import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import superagent from 'superagent';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Modal, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reminder_module.css';

class ReminderModule extends React.Component {
    state = {
        showSuccessModal: false,
        showFailureModal: false,
        startDate: new Date(),
    };

    handleDateChange = (date) => {
        this.setState({
            startDate: date,
        });
    };

    closeSuccessModal = () => {
        this.setState({showSuccessModal: false, showFailureModal: false});
    };

    handleSubmit = (values, setSubmitting, resetForm) => {
        const {emailSubject, recipients, emailBody} = values;
        const {startDate: reminderDate} = this.state;

        const emailIds = recipients.split(/[{,\s}]/, 10);

        const subject = 'snooZed: '.concat(emailSubject);
        const body = emailBody;

        superagent
            .post('https://afvvxda1wl.execute-api.us-west-1.amazonaws.com/beta/reminders')
            .send({
                dueDate: new Date(reminderDate).toISOString(),
                email: {
                    to: emailIds,
                    subject,
                    textBody: body,
                    htmlBody: body.concat('<br/><br/>This email was sent by <strong>snooZe US</strong><br/><br/>'),
                },
                appendScheduleDateToBody: true,
            }) // sends a JSON post body
            .set('X-API-Key', '1OYL0FAalZ1PtBXJKG0u03iwQQlwXBK57Hj4TFEp')
            .set('accept', 'json')
            .then((res) => {
                // console.log('Reminder created successfully: ', res);
                resetForm({});
                setSubmitting(false);
                this.setState({showSuccessModal: true});
            })
            .catch((err) => {
                console.log('Encountered an error: ', err);
                this.setState({showFailureModal: true});
                setSubmitting(false);
            });
    };

    render() {
        const currentDate = new Date();
        const {showSuccessModal, showFailureModal} = this.state;

        return (
            <div className="reminder-module">
                <Modal show={showSuccessModal || showFailureModal} onHide={this.closeSuccessModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{showSuccessModal ? 'Success!' : 'Oops!'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showSuccessModal
                            ? 'The reminder was created successfully. Feel free to create another one.'
                            : 'There was a problem creating the reminder. Please try again in some time.'}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeSuccessModal}>
                            {showSuccessModal ? 'Awesome!' : 'Okay'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Formik
                    initialValues={{emailSubject: '', recipients: '', emailBody: ''}}
                    validationSchema={Yup.object({
                        emailSubject: Yup.string().max(40, 'Must be 40 characters or less').required('Required'),
                        emailBody: Yup.string().max(1000, 'Must be 1000 characters or less'),
                        recipients: Yup.array()
                            .transform(function (value, originalValue) {
                                if (this.isType(value) && value !== null) {
                                    return value;
                                }
                                return originalValue ? originalValue.split(/[{,\s}]/, 10) : [];
                            })
                            .of(Yup.string().email(({value}) => `${value} is not a valid email`))
                            .required('Required'),
                    })}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        this.handleSubmit(values, setSubmitting, resetForm);
                    }}
                >
                    {({errors, handleSubmit, handleChange, isSubmitting, isValid, status, values}) => (
                        <Form id="reminder-form" loading={isSubmitting}>
                            <label htmlFor="emailSubject">Remind me to</label>
                            <Field
                                name="emailSubject"
                                type="text"
                                placeholder="eg. Cancel my netflix subscription"
                                className="reminder-info-field"
                            />
                            <ErrorMessage component="span" className="error" name="emailSubject" />
                            <label htmlFor="recipients">Email Address</label>
                            <Field name="recipients" placeholder="abc@xyz.com, pqr@zyx.com" type="text" />
                            <ErrorMessage name="recipients" component="span" className="error" />
                            <label htmlFor="emailBody">Details</label>
                            <Field name="emailBody" type="text" as="textarea" placeholder="optional" />
                            <ErrorMessage name="emailBody" component="span" className="error" />
                            <label htmlFor="reminderDate">Remind me on</label>
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
                                className="datePicker"
                            />
                            <ErrorMessage component="span" name="reminderDate" className="error" />

                            <button type="submit" className="confirm-reminder-button" disabled={isSubmitting}>
                                Create Reminder
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default ReminderModule;
