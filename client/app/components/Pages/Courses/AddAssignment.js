import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import AssignmentCard from '../Assignments/AssignmentCard';
class AssignmentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            name: '',
            uniqueID: '',
            type: '',
            details: '',
            maxMarks: undefined,
            edit: undefined,
            resourcesUrl: '',
            startDate: '',
            endDate: '',
            assignment: {},
            assignments: [],
            show: false
        };
        this.onAdd = this.onAdd.bind(this);
        this.showForm = this.showForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUniqueidChange = this.handleUniqueidChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDetailsChange = this.handleDetailsChange.bind(this);
        this.handleMarksChange = this.handleMarksChange.bind(this);
        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }
    componentDidMount() {
        let self = this;
        let userID = localStorage.getItem('user_id');
        const {match: {params}} = this.props;

        let token = localStorage.getItem('token');

        let apiPath = '/api/account/' + userID + '/details';
        axios.get(apiPath, {
            headers: {
                'x-access-token': token
            }
        })
            .then(function(response) {
                if (!response.data.success) {
                    // TODO: throw appropriate error and redirect
                    console.log('Error1: ' + response.data);
                    return;
                }
                let data = response.data;
                self.setState({
                    role: data.user.role
                });
            })
            .catch(function(error) {
                console.log('Error2: ', error);
            });

        // /api/assignments/:courseID/assignments
        axios.get(`/api/assignments/${params.courseID}/assignments`, {
            headers: {
                'x-access-token': token
            }
        }).then(function(response) {
            if (!response.data.success) {
                console.log('Error1: ' + response.data);
            }
            let data = response.data;
            self.setState({
                assignments: self.state.assignments.concat(data.assignments.assignments)
            });
            console.log(response.data);
        })
            .catch(function(error) {
                console.log('Error2: ', error);
            });
    }
    handleNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }
    handleUniqueidChange(e) {
        this.setState({
            uniqueID: e.target.value
        });
    }
    handleTypeChange(e) {
        this.setState({
            type: e.target.value
        });
    }
    handleDetailsChange(e) {
        this.setState({
            details: e.target.value
        });
    }
    handleMarksChange(e) {
        this.setState({
            maxMarks: e.target.value
        });
    }
    handleURLChange(e) {
        this.setState({
            resourcesUrl: e.target.value
        });
    }
    handleStartDateChange(e) {
        this.setState({
            startDate: e.target.value
        });
    }
    handleEndDateChange(e) {
        this.setState({
            endDate: e.target.value
        });
    }
    reload() {
        window.location.reload();
    }
    onAdd() {
        // /api/assignment/:userID/createAssignment
        let self = this;
        let userID = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        const {match: {params}} = this.props;

        let config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        };
        let data = Object.assign({}, self.state.assignment);
        data.updateID = self.state.edit;
        data.name = self.state.name;
        data.uniqueId = self.state.uniqueID;
        data.type = self.state.type;
        data.courseID = params.courseID;
        data.maxMarks = self.state.maxMarks;
        data.details = self.state.details;
        data.resourcesUrl = self.state.resourcesUrl;
        data.duration = {startDate: self.state.startDate, endDate: self.state.endDate};
        data = JSON.stringify(data);
        console.log(data);
        axios.post(`/api/assignments/${userID}/createAssignment`, data, config)
            .then((res) => {
                console.log(res.data);
                this.reload();
            })
            .catch((err) => {
                console.log(err);
                alert('Assignment Failed to Upload!');
            });
    }
    showForm() {
        this.setState({
            show: true
        });
    }
    closeForm() {
        this.setState({
            show: false
        });
    }
    editAssignment(assignID) {
        console.log("editing: ", assignID);
        // console.log(typeof(this.state.assignments));
        let assignToBeEdited = this.state.assignments.find(function(assign) {
            return assign._id == assignID;
        });
        console.log(assignToBeEdited);
        assignToBeEdited.duration = assignToBeEdited.duration || {startDate: "2000-01-01", endDate: "2000-01-01"};
        this.setState({
            edit: assignID,
            show: true,
            name: assignToBeEdited.name,
            uniqueID: assignToBeEdited.uniqueID,
            type: assignToBeEdited.type,
            details: assignToBeEdited.details,
            maxMarks: assignToBeEdited.maxMarks,
            resourcesUrl: assignToBeEdited.resourcesUrl,
            startDate: assignToBeEdited.duration.startDate.slice(0, 10),
            endDate: assignToBeEdited.duration.endDate.slice(0, 10)
        });
    }
    deleteAssignment(assignID) {
        console.log("deleting: ", assignID);
        let self = this;
        let userID = localStorage.getItem('user_id');
        let token = localStorage.getItem('token');
        const {match: {params}} = this.props;

        let config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        };
        let data = Object.assign({}, self.state.assignment);
        data.assignID = assignID;
        data.courseID = params.courseID;
        data = JSON.stringify(data);

        axios.post(`/api/assignments/${userID}/deleteAssignment`, data, config)
            .then((res) => {
                console.log(res.data);
                this.reload();
            })
            .catch((err) => {
                console.log(err);
                alert('Assignment Failed to Upload!');
            });
    }
    render() {
        let content;
        const click = (
            <div>
                <form>
                    <div className="form-group text-left">
                        <h6>Assignment Name</h6>
                        <input type="text" className="form-control " placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Unique ID</h6>
                        <input type="text" className="form-control" placeholder="Unique ID" value={this.state.uniqueID} onChange={this.handleUniqueidChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Type</h6>
                        <label className="radio-inline"><input type="radio" value="file-upload" name="optradio" checked={this.state.type === 'file-upload'} onChange={this.handleTypeChange}></input>File Upload</label>
                        <label className="radio-inline"><input type="radio" value="quiz" name="optradio" checked={this.state.type === 'quiz'} onChange={this.handleTypeChange}></input>Quiz</label>
                    </div>
                    <div className="form-group text-left">
                        <h6>Assignment Details</h6>
                        <textarea className="form-control" placeholder="Details" value={this.state.details} onChange={this.handleDetailsChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Maximum Marks</h6>
                        <input type="number" className="form-control" placeholder="Maximum Marks" value={this.state.maxMarks} onChange={this.handleMarksChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Duration</h6>
                        <label>Start Date</label>
                        <input type="date" className="form-control" placeholder="Start Date" value={this.state.startDate} onChange={this.handleStartDateChange} />
                        <label>End Date</label>
                        <input type="date" className="form-control" placeholder="End Date" value={this.state.endDate} onChange={this.handleEndDateChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Resources</h6>
                        <input type='text' className="form-control" placeholder="URLs" value={this.state.resourcesUrl} onChange={this.handleURLChange} />
                    </div>
                </form>
            </div>
        );
        let that = this;
        console.log("XXXXXXX", this.state.assignments);
        const AssignmentContent = (
            <div>
                {
                    this.state.assignments.map(function(each) {
                        console.log();
                        return <AssignmentCard dueDate={each.duration.endDate.slice(0, 10)} deleteAssign={that.deleteAssignment.bind(that)} editAssign={that.editAssignment.bind(that)} key={each.uniqueID} uniqueID={each.uniqueID} name={each.name} details={each.details} type={each.type.toUpperCase()} maxMarks={each.maxMarks} resourceUrl={each.resourcesUrl} assignmentID={each._id} submissions={each.submissions} role={that.state.role} />;
                    })
                }
            </div>
        );
        content = AssignmentContent;

        let addAssignmentContent = (<div></div>);

        if (this.state.role == 'admin' || this.state.role == 'prof') {
            addAssignmentContent = (
                <div className='col-sm-5'>
                    <div className='card text-center bg-light'>
                        <div className='card-body '>
                            {this.state.show ? click : <button type="button" className="btn btn-dark w-20 mx-3" onClick={this.showForm}>Add Assignment</button>}
                            {this.state.show ? null : <button className="btn w-20 mx-3"><Link className='text-dark' to="/courses"> Back To Courses </Link></button>}
                            {this.state.show ? <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.onAdd}>Submit</button> : null}
                            {this.state.show ? <button type="close" className="btn w-20 mx-3" onClick={this.closeForm}>Close</button> : null}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className='row'>
                    <div className='col'>
                        <div className="display-4 text-center">{this.props.location.state.code}: {this.props.location.state.name}</div>
                    </div>
                </div>
                <hr />
                <div className='details'>
                    <h5>Department:</h5>{this.props.location.state.department}<br /><br />
                    <h5>Semester: </h5>{this.props.location.state.semester}<br /><br />
                    <h5>Course Description: </h5>{this.props.location.state.description}<br /><br />
                    <h5>Resources URL: </h5>{this.props.location.state.resourceUrl}<br /><br />
                    <h5>Number of Credits: </h5>{this.props.location.state.credits}<br /><br />
                    <h5>Number of Hours: </h5>{this.props.location.state.hours}<br /><br />
                    <h5>Marks Distribution</h5><br />
                    <table>
                        <tbody>
                            <tr>
                                <th>Exam</th>
                                <th>Marks Alloted</th>
                            </tr>
                            <tr>
                                <td>T1</td>
                                <td>{this.props.location.state.t1}</td>
                            </tr>
                            <tr>
                                <td>T2</td>
                                <td>{this.props.location.state.t2}</td>
                            </tr>                    
                            <tr>
                                <td>Assignments</td>
                                <td>{this.props.location.state.assignment}</td>
                            </tr>                    
                            <tr>
                                <td>ESA</td>
                                <td>{this.props.location.state.esa}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>100</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-sm-7'>
                        <h1 className='text-center'>
                            Assignments for this course
                        </h1>
                        <hr />
                        {content}
                    </div>
                    {addAssignmentContent}
                </div>
            </div>
        );
    }
}
export default AssignmentAdd;
