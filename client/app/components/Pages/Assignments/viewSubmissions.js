import React, {Component} from 'react';
import axios from 'axios';
import SubmissionsCard from '../Assignments/submissionsCard';

class viewSubmissions extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            submissions: []
        });
    }

    componentDidMount() {
        // get details

        // /api/assignments/:assignmentID/submissions
        let token = localStorage.getItem('token');
        axios.get(`/api/assignments/${this.props.location.state.assignmentID}/submissions`, {
            headers: {
                'x-access-token': token
            }
        })
            .then((res) => {
                console.log(res);
                this.setState({
                    submissions: res.data.data.assignment.submissions
                });
            })
            .catch((err) => console.log(err));
    }
    // add usn
    render() {
        let content = (
            <div>
                <h1>No submissions yet.</h1>
            </div>
        );

        if (this.state.submissions.length) {
            content = (
                <div>
                    {
                        this.state.submissions.map(function(each) {
                            return <SubmissionsCard key={each.user} fileID={each.file} user={each.user}/>;
                        })
                    }
                    <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
                </div>
            );
        }
        // content = Content;
        return (
            <div>
                {content}
            </div>
        );
    }
}

export default viewSubmissions;
