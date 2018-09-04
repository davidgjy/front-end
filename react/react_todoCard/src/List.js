import React, { PropTypes } from 'react';
import Card from './Card';
import { DropTarget } from 'react-dnd';
import constants from './constants';

const listTargetSpec = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updateStatus(draggedId, props.id);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

class List extends React.Component {
    render() {
        const { connectDropTarget } = this.props;
        let cards = this.props.cards.map((card) => {
            return (<Card key={card.id}
                         taskCallbacks={this.props.taskCallbacks}
                          cardCallbacks={this.props.cardCallbacks}
                          {...card} />);

        });

        return connectDropTarget(
            <div className="list mdl-cell mdl-cell--4-col">
                <h1>{this.props.title}</h1>
                {cards}
            </div>
        );
    }
}

List.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDropTarget: PropTypes.func.isRequired
};
export default DropTarget(constants.CARD, listTargetSpec, collect)(List);