import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Spinner from "./../layout/Spinner";
import { connect } from "react-redux";
import { getProfileById } from "./../../actions/profile";
import { Link, useParams } from "react-router-dom";

const Profile = ({ profile: { profile, loading }, auth, getProfileById }) => {
  let { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, []);

  return profile == null || loading ? (
    <Spinner />
  ) : (
    <>
      <div className="container">
        <Link to="/profiles" className="btn btn-light">
          Back to Profiles
        </Link>

        {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user._id === profile.user._id && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}
      </div>
    </>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
