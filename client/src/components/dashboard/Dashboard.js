import React, { useEffect } from 'react'

import { getCurrentProfile } from '../../actions/profiles';

import { connect } from 'react-redux';
import PropTypes from 'prop-types'

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
    useEffect(() => {
        getCurrentProfile();
    }, []);
    return (
        <div>
            Dashboard
        </div>
    );
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
