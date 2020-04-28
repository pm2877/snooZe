import React from 'react';
import DatePicker from 'react-datepicker';
import './reminder_module.css';
import 'react-datepicker/dist/react-datepicker.css';
import superagent from 'superagent';

class ReminderModule extends React.Component {
    state = {
        titleText: '',
        descriptionText: '',
        emailText: '',
        startDate: new Date(),
    };

    handleTitleChange = (event) => {
        this.setState({
            titleText: event.target.value,
        });
    };

    handleEmailChange = (event) => {
        this.setState({
            emailText: event.target.value,
        });
    };

    handleDescriptionChange = (event) => {
        this.setState({
            descriptionText: event.target.value,
        });
    };

    handleDateChange = (date) => {
        this.setState({
            startDate: date,
        });
        console.log(this.state.startDate);
    };

    handleSubmit = (event) => {
        const emailIds = this.state.emailText.split(/[{,\s}]/, 5);
        const emailSubject = 'snooZed: '.concat(this.state.titleText).slice(0, 40);
        const emailBody = 'snooZed: '
            .concat(this.state.titleText.slice(40, emailSubject.length))
            .concat(this.state.descriptionText)
            .slice(1000);

        superagent
            .post('https://afvvxda1wl.execute-api.us-west-1.amazonaws.com/beta/reminders')
            .send({
                dueDate: new Date(this.state.startDate).toISOString(),
                email: {
                    to: emailIds,
                    subject: emailSubject,
                    textBody: emailBody,
                    htmlBody: emailBody.concat('<br/><br/>This email was sent by <strong>snooZe US</strong><br/><br/>'),
                },
                appendScheduleDateToBody: true,
            }) // sends a JSON post body
            .set('X-API-Key', '1OYL0FAalZ1PtBXJKG0u03iwQQlwXBK57Hj4TFEp')
            .set('accept', 'json')
            .then((res) => {
                console.log('Reminder created successfully: ', res);
            })
            .catch((err) => {
                console.log('Encountered an error: ', err);
            });
        event.preventDefault();
    };

    render() {
        const currentDate = new Date();

        return (
            <div className="reminder-module">
                <form onSubmit={this.handleSubmit} className="reminder-form">
                    <label>
                        Remind me to
                        <input
                            placeholder="eg. Cancel my netflix subscription"
                            type="text"
                            value={this.state.titleText}
                            onChange={this.handleTitleChange}
                        />
                    </label>
                    <label>
                        Email
                        <input type="text" value={this.state.emailText} onChange={this.handleEmailChange} />
                    </label>
                    <label>
                        Details
                        <textarea
                            type="text"
                            placeholder="Optional"
                            value={this.state.descriptionText}
                            onChange={this.handleDescriptionChange}
                        />
                    </label>
                    <label>
                        Remind me on
                        <DatePicker
                            placeholderText="Click to select a date"
                            selected={this.state.startDate}
                            showMonthDropdown
                            showYearDropdown
                            showTimeInput
                            dropdownMode="select"
                            minDate={currentDate}
                            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 60))}
                            timeInputLabel="Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            onChange={this.handleDateChange}
                        />
                    </label>
                    <input type="submit" value="Create Reminder" className="confirm-reminder-button" />
                </form>
            </div>
        );
    }
}

export default ReminderModule;
