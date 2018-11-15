import React from "react";
import PropTypes from "prop-types";
import Image from "../../article/images/Image";

const ImagePreviewCard = props => {
    const { 
        link, 
        caption, 
        index, 
        onChangeCaption 
    } = props;
    return (
        <div className="ImagePreviewCard">
            <Image link={link} />
            <div className="ImageCaption">
                <input
                    className="ImageCaption__Input"
                    type="text"
                    value={caption}
                    onChange={onChangeCaption(index)}
                />
            </div>
        </div>
    );
};

export default ImagePreviewCard;