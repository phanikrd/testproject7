import React from 'react';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './userPhotos.css';
import axios from 'axios';

class UserPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: undefined,
            userPhotosDetails: undefined,
            advancedFeaturesEnabled: false,
            currentPhotoIndex: 0,
        };
    }

    componentDidMount() {
        const newUserId = this.props.match.params.userId;
        this.handleUserChange(newUserId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            const newUserId = this.props.match.params.userId;
            this.handleUserChange(newUserId);
        }
    }

    handleUserChange(userId) {
        axios.get(`/photosOfUser/${userId}`).then((response) => {
            this.setState({
                userId: userId,
                userPhotosDetails: response.data,
            });
        });
        axios.get(`/user/${userId}`).then((response) => {
            const new_user = response.data;
            const main_content = `User Photos for ${new_user.first_name} ${new_user.last_name}`;
            this.props.changeTopbarContent(main_content);
        });
    }

    toggleAdvancedFeatures = () => {
        this.setState((prevState) => ({
            advancedFeaturesEnabled: !prevState.advancedFeaturesEnabled,
        }));
    };

    handlePrevious = () => {
        this.setState((prevState) => ({
            currentPhotoIndex: Math.max(0, prevState.currentPhotoIndex - 1),
        }));
    };

    handleNext = () => {
        this.setState((prevState) => ({
            currentPhotoIndex: Math.min(
                prevState.userPhotosDetails.length - 1,
                prevState.currentPhotoIndex + 1
            ),
        }));
    };

    renderAdvancedPhotoView(userPhotosDetails) {
        const { currentPhotoIndex } = this.state;
        const totalPhotos = userPhotosDetails.length;
        const currentPhoto = userPhotosDetails[currentPhotoIndex];

        return (
            <div>
                {/* Previous Button */}
                <button
                    onClick={this.handlePrevious}
                    disabled={currentPhotoIndex === 0}
                >
                    Previous
                </button>

                {/* Display the current photo */}
                <img src={`/images/${currentPhoto.file_name}`} />

                {/* Next Button */}
                <button
                    onClick={this.handleNext}
                    disabled={currentPhotoIndex === totalPhotos - 1}
                >
                    Next
                </button>

                {/* Comments */}
                {currentPhoto.comments && currentPhoto.comments.map((userComment) => (
                    <div key={`photoDate_${userComment._id}`}>
                        <TextField
                            disabled
                            fullWidth
                            id="outlined-disabled"
                            label="Comment Date"
                            className="custom-field"
                            value={userComment.date_time}
                        />
                        <TextField
                            fullWidth
                            id="outlined-disabled"
                            component={Link}
                            to={`/users/${userComment.user._id}`}
                            label="User"
                            className="custom-field"
                            value={`${userComment.user.first_name} ${userComment.user.last_name}`}
                        />
                        <TextField
                            disabled
                            fullWidth
                            id="outlined-disabled"
                            label="Comment"
                            multiline
                            rows={5}
                            className="custom-field"
                            value={userComment.comment}
                        />
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { userId, userPhotosDetails, advancedFeaturesEnabled } = this.state;

        return userId ? (
            <div>
                <div className="advanced-features">
                    <Button
                        variant="contained"
                        size="medium"
                        component={Link}
                        to={`/users/${userId}`}
                        className="button"
                    >
                        USER DETAILS
                    </Button>
                    <label className="advanced-features-checkbox">
                        <input
                            type="checkbox"
                            checked={advancedFeaturesEnabled}
                            onChange={this.toggleAdvancedFeatures}
                        />
                        Enable Advanced Features
                    </label>
                </div>
                {advancedFeaturesEnabled
                    ? this.renderAdvancedPhotoView(userPhotosDetails)
                    : (
                        <div>
                            {userPhotosDetails.map((userPhotoDetail) => (
                                <div key={userPhotoDetail._id}>
                                    <TextField
                                        disabled
                                        fullWidth
                                        id="outlined-disabled"
                                        label="Photo Date"
                                        className="custom-field"
                                        value={userPhotoDetail.date_time}
                                    />
                                    <img
                                        src={`/images/${userPhotoDetail.file_name}`}
                                        className="custom-field"
                                    />
                                    {userPhotoDetail.comments && userPhotoDetail.comments.map((userComment) => (
                                        <div key={`photoDate_${userComment._id}`}>
                                            <TextField
                                                disabled
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Comment Date"
                                                className="custom-field"
                                                value={userComment.date_time}
                                            />
                                            <TextField
                                                fullWidth
                                                id="outlined-disabled"
                                                component={Link}
                                                to={`/users/${userComment.user._id}`}
                                                label="User"
                                                className="custom-field"
                                                value={`${userComment.user.first_name} ${userComment.user.last_name}`}
                                            />
                                            <TextField
                                                disabled
                                                fullWidth
                                                id="outlined-disabled"
                                                label="Comment"
                                                multiline
                                                rows={5}
                                                className="custom-field"
                                                value={userComment.comment}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        ) : (
            <div />
        );
    }
}

export default UserPhotos;
