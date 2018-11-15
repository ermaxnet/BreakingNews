import React, { Component as ReactComponent } from "react";
import Touch from "./Touch";
import TouchBox from "../../../../../wwwroot/scripts/components/touch/Comment/CommentBox";
import { connect } from "react-redux";
import { connect as timelineConnect } from "../../../../../wwwroot/scripts/models/Touch";

class Touches extends ReactComponent {
    componentDidMount() {
        timelineConnect();
    }
    render() {
        const { touches } = this.props;
        if(touches === null || touches.size === 0) {
            return null;
        }
        return (
            <div className="TouchesBox">
                <div className="TouchBox">
                    <TouchBox />
                </div>
                <div className="Timeline">
                    <ol className="TimelineList">
                        {touches.map(item => 
                            <Touch key={item.id} item={item} />
                        )}
                    </ol>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    touches: state.timeline.get("touches")
});

export default connect(mapStateToProps)(Touches);