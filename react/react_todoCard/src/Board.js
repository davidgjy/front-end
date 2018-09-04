import React, { PropTypes } from 'react';
import List from './List';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Board extends React.Component {
    render() {
        return (
            <div className="app mdl-grid">
                <List id="todo" title="Too Do" taskCallbacks={this.props.taskCallbacks}
                       cardCallbacks={this.props.cardCallbacks}
                      cards={this.props.cards.filter((card)=> card.status==="todo")
                } />
                <List id="in-progress" title="In Progress" taskCallbacks={this.props.taskCallbacks} 
                        cardCallbacks={this.props.cardCallbacks}
                        cards={this.props.cards.filter((card)=> card.status==="in-progress")
                } />
                <List id="done" title="Done" taskCallbacks={this.props.taskCallbacks} 
                    cardCallbacks={this.props.cardCallbacks}
                    cards={this.props.cards.filter((card)=> card.status==="done")
                } />
            </div>
        );
    }
}
Board.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object
};
export default DragDropContext(HTML5Backend)(Board);