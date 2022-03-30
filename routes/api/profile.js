const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'Profile not found for this user.' })
        }

        return res.json(profile);

    } catch (error) {
        return res.status(500).send('Server Error');
    }

});

// @route   POST api/profile/
// @desc    Create user profile
// @access  Private
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    
    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram
    } = req.body;

    // Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(status) profileFields.status = status;
    if(skills) { 
        profileFields.skills = skills.split(',').map( skill => skill.trim());
    }
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    
    // Build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    
    try {
        
        let profile = await Profile.findOne({ user: req.user.id });
        
        // Update profile
        if(profile){
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
 
        }

        // Create profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
    
});

// @route   GET api/profile/
// @desc    Get all user's profile
// @access  Public
router.get('/', async (req, res) => {

    try {
        
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }        
})

// @route   GET api/profile/user/:user_id
// @desc    Get specific user's profile
// @access  Public
router.get('/user/:user_id', async (req, res) => {

    try {      
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        return res.json(profile);

    } catch (error) {

        if(error.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        console.error(error.message);
        return res.status(500).send('Server Error');
    }        
})

// @route   DELETE api/profile/
// @desc    Delete current user, profile and posts
// @access  Private
router.delete('/', auth, async (req, res) => {

    try {
        // Delete user's post
        await Post.deleteMany({ user: req.user.id })

        // Delete user's profile
        await Profile.findOneAndRemove({ user: req.user.id });
        
        // Delete user
        await User.findOneAndRemove({ _id: req.user.id });
        
        return res.json({ msg: 'User deleted.' });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }        
})

// @route   PUT api/profile/experience
// @desc    Add user's experience
// @access  Private
router.put('/experience', [ auth, [
    check('title', 'Title is required').not().isEmpty(),    
    check('company', 'Company is required').not().isEmpty(),    
    check('location', 'Location is required').not().isEmpty(),    
    check('from', 'From date is required').not().isEmpty()
] ] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const userExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(userExperience);

        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
})

// @route   DELETE api/profile/experience/exp_id
// @desc    Remove user's experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        
        const profile = await Profile.findOne({ user: req.user.id });
        
        profile.experience = profile.experience.filter( exp =>  
            exp._id.toString() !== req.params.exp_id 
        )
        
        await profile.save();
        
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('server error');
    }
});



// @route   PUT api/profile/education
// @desc    Add user's education
// @access  Private
router.put('/education', [ auth, [
    check('school', 'School is required').not().isEmpty(),    
    check('degree', 'Degree is required').not().isEmpty(),    
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),    
    check('from', 'From date is required').not().isEmpty()
] ] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const userEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.education.unshift(userEducation);

        await profile.save();

        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
})

// @route   DELETE api/profile/education/edu_id
// @desc    Remove user's education
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        
        const profile = await Profile.findOne({ user: req.user.id });
        
        profile.education = profile.education.filter( edu =>  
            edu._id.toString() !== req.params.edu_id 
        )
        
        await profile.save();
        
        res.json(profile);
        
    } catch (error) {
        console.error(error.message);
        
        if(error.kind == 'ObjectId'){
            return res.status(500).send('Education not found for this id');    
        }
        return res.status(500).send('server error');
    }
});

// @route   GET api/profile/github/username
// @desc    Get github repositories
// @access  Public
router.get( '/github/:username' , (req, res) => {

    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githunSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }
        request( options, (error, response, body) => {

            if(error){
                console.error(error.message);
                return res.status(400).json({ errors: error}) 
            }

            if(response.statusCode !== 200){
                return res.status(404).json({ msg: 'Repository not found'}) 
            }

            res.json(JSON.parse(body));
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;