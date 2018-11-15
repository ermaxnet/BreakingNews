import React, { Component as ReactComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Like from "../../../../../wwwroot/scripts/components/touch/Comment/Like";
import Comments from "../../../../../wwwroot/scripts/components/touch/Comment/CommentCaption";

class Touch extends ReactComponent {
    static propTypes = {
        item: PropTypes.object.isRequired
    }

    toggleLike(e) {
        console.log(e);
    }
    onComment(e) {
        console.log(e);
    }

    render() {
        const { item, item: { user } } = this.props;
        const time = moment(item.time);
        return (
            <li 
                className="TouchContext" 
                id={`timeline-item-touch-${item.id}`}
                data-item-id={item.id}
                data-item-type="touch"
            >
                <article className="Touch">
                    <div className="TouchContent">
                        <header className="Author">
                            <img 
                                className="AuthorPhoto"
                                src={user.photo}
                                alt={user.name}
                            />
                            <strong className="AuthorName">{user.name}</strong>
                            <time 
                                className="TouchTime"
                                dateTime={item.time} 
                                data-time-ms={time.valueOf()}
                            >
                                &nbsp;&middot;&nbsp;
                                {time.fromNow()}
                            </time>
                        </header>
                        <div 
                            className="Text" 
                            dangerouslySetInnerHTML={{ __html: item.text }}>
                        </div>
                        <footer className="Caption">
                            <ul className="CaptionList">
                                <li className="Action">
                                    <Like 
                                        likeIt={item.you_like_it} 
                                        likesCount={item.likes_count}
                                        toggleLike={this.toggleLike.bind(this)}
                                    />
                                </li>
                                <li className="Action">
                                    <Comments
                                        commentsCount={item.comments_count}
                                        onComment={this.onComment.bind(this)}
                                    />
                                </li>
                            </ul>
                        </footer>
                    </div>
                </article>
            </li>
        );
    }
};

export default Touch;