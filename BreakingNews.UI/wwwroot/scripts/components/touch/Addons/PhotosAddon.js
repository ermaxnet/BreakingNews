import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import Icon from "../../common/Icon";
import { ADDONS } from "../../../constants";
import { Addon, Photos } from "../../../models/Addon";

export class PhotosAddonButton extends ReactComponent {
    static propTypes = {
        type: PropTypes.string,
        state: PropTypes.instanceOf(Addon),
        maxPhotos: PropTypes.number,
        onChange: PropTypes.func.isRequired
    }
    static defaultProps = {
        type: ADDONS.PHOTOS,
        maxPhotos: 3
    }

    get isDisabled() {
        const { state } = this.props;
        if(state === null) {
            return false;
        }
        return state.type !== this.props.type 
            || (state.photos && state.photos.length >= this.props.maxPhotos);
    }

    onChange(e) {
        let { state, onChange } = this.props;
        state = (state instanceof Photos) ? state : new Photos();
        for (let idx = 0; idx < e.target.files.length; idx++) {
            state.add(URL.createObjectURL(e.target.files[idx]));
        }
        onChange(state, () => {
            this.node.value = null;
        });
    }
    render() {
        return (
            <div className={`photos-addon${this.isDisabled ? " photos-addon--disabled" : ""}`}>
                <button 
                    className="photos-addon__button"
                    aria-hidden="true"
                    disabled={this.isDisabled}
                >
                    <Icon 
                        family="far"
                        iconClass="fa-image" 
                    />
                </button>
                <div className="photos-addon__hidden">
                    <input
                        ref={node => { this.node = node; }}
                        onChange={this.onChange.bind(this)}
                        className="photos-addon__input"
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={this.isDisabled}
                    />
                </div>
            </div>
        );
    }
};

class PhotosAddon extends ReactComponent {
    static propTypes = {
        model: PropTypes.instanceOf(Photos).isRequired,
        onChange: PropTypes.func.isRequired
    }

    removeImage(index) {
        let { model, onChange } = this.props;
        model.photos.splice(index, 1);
        if(model.photos.length === 0) {
            model = null;
        }
        onChange(model);
    }
    imageDone(e) {
        const image = e.target;
        const { clientWidth: minWidth, clientHeight: minHeight } = image.parentNode;
        const { clientWidth, clientHeight } = image;

        const resize = (maxWidth, maxHeight) => {
            const ratio = Math.min(maxWidth / clientWidth, maxHeight / clientHeight);
            const width = clientWidth * ratio;
            const height = clientHeight * ratio;
            if(width < minWidth || height < minHeight) {
                return resize(maxWidth + 1, maxHeight + 1);
            }
            return { width, height };
        };
        
        const { width, height } = resize(minWidth, minHeight);
        const marginLeft = (width - minWidth) / (-2);
        const marginTop = (height - minHeight) / (-2);

        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        image.style.marginLeft = `${marginLeft}px`;
        image.style.marginTop = `${marginTop}px`;
    }
    render() {
        const { model } = this.props;
        return (
            <div className="photos-thumbnails">
                <div className="photos-thumbnails__list">
                    <div className="container">
                        {model.photos.map((photo, index) => {
                            return (
                                <div 
                                    key={index}
                                    className="thumbnail"
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="thumbnail-container">
                                        <img 
                                            className="thumbnail__image"
                                            src={photo}
                                            alt="no"
                                            draggable={false}
                                            onLoad={this.imageDone.bind(this)}
                                        />
                                    </div>
                                    <div className="thumbnail-remove" onClick={() => this.removeImage(index)}>
                                        <Icon iconClass="fa-times" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default PhotosAddon;