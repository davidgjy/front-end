import React, { PropTypes } from 'react';

class CheckList extends React.Component {
    constructor(props) {
        super(props);
        this.checkInputKeyPress = this.checkInputKeyPress.bind(this);
    }
    checkInputKeyPress(evt) {
        if (evt.key === 'Enter') {
            this.props.taskCallbacks.add(this.props.cardId, evt.target.value);
            evt.target.value = '';
        }
    }
    render() {
        let tasks = this.props.tasks.map((task, taskIndex) => (
            <li key={task.id} className="checklist_task">
                <input type="checkbox" defaultChecked={task.done} 
                       onChange={ this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, taskIndex)}/>
                {task.name}{' '}
                <a href="#" className="checklist_task--remove" onClick={
                     this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, taskIndex)
                    }/>
            </li>
        ));

        return (
            <div className="checklist">
                <ul>{tasks}</ul>
                <input type="text"
                       className="check--add-task"
                       placeholder="Type then hit Enter to add a task" 
                       onKeyPress={this.checkInputKeyPress}/>
            </div>
        );
    }
}
CheckList.propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardId: PropTypes.number
};
export default CheckList;