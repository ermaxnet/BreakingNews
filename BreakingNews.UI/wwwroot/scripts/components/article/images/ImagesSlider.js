import React, { Component as ReactComponent } from "react";
import ReactSlick from "react-slick";
import PropTypes from "prop-types";
import { List, Record } from "immutable";
import Image from "./Image";

const ImageRecord = Record({
    key: 0,
    link: null,
    caption: ""
});

export default class ImagesSlider extends ReactComponent {
    static propTypes = {
        links: PropTypes.arrayOf(PropTypes.string),
        canSettings: PropTypes.bool
    }
    static defaultProps = {
        links: [],
        canSettings: true
    }

    state = {
        images: List(
            this.props.links.map((link, index) => new ImageRecord({
                key: index,
                link
            }))
        )
    }

    render() {
        let { images } = this.state;
        if(images.size < 1) {
            return null;
        } 
        images = images.toArray();
        return (
            <ReactSlick 
                ref={node => { this.stickNode = node; }}
                className="ImagesSlider" 
                dots={true}
                dotsClass="ImagesSlider__SlideBullets"
            >
                {images.map(image => {
                    return (
                        <figure
                            key={image.get("key")}
                            className="ImagesSlider__Slide"
                        >
                            <Image link={image.get("link")} />
                            {image.get("caption") && (
                                <figcaption 
                                    className="ImageCaption"
                                >{image.get("caption")}</figcaption>
                            )}
                        </figure>
                    );
                })}
            </ReactSlick>
        );
    }
};
