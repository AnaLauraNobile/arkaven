import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from './styles.js';

export default function ResetPassword({ changeModal, openModal, closeModal }) {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const validateEmail = () => {
        return email.length === 0;
    };

    const handleSubmit = () => {
        setLoading(true);

        const data = {
            email,
        };

        axios.post('/api/resetPassword', data)
            .then(res => {
                closeModal();
                Swal.fire({
                    icon: 'success',
                    text: 'Recovery link sent, please check your email.',
                });
            })
            .catch(err => {
                closeModal();

                setLoading(false);

                Swal.fire({
                    icon: 'error',
                    text: err.response.data.errorMessage,
                })
                    .then(() => openModal())
                    .catch(err => console.log(err));
            });
    };

    return (
        <div className={classes.container}>
            <div className={classes.headerContainer}>
                <h2 className={classes.header}>Reset your password</h2>
                <span className={classes.divider}>or</span>
                <p className={classes.subHeader}>
                    Go back to
                            <span className={classes.subLink} onClick={() => changeModal('login')}> Log In</span>
                </p>
            </div>
            <div className={classes.fieldsContainer}>
                <div className={classes.textDiv}>
                    <TextField
                        label="Enter your email"
                        type='email'
                        value={email}
                        className={classes.textField}
                        onChange={handleChange}
                    />
                </div>
                {loading ?
                    <CircularProgress className={classes.loading} />
                    :
                    <Button
                        variant="contained"
                        disabled={validateEmail()}
                        className={classes.resetButton}
                        onClick={handleSubmit}
                    >
                        Send recovery email
                    </Button>
                }
            </div>
        </div>
    );
};