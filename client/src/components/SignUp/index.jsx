import React, { useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn, getLoggedUser, getAllUsers, getUserData } from '../../redux/userReducer/actions';
import axios from 'axios';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from './styles.js';
import back from '../../videos/back.mp4';


export default function SignUp({ changeModal, openModal, closeModal }) {
    const classes = useStyles();
    const ref1 = useRef();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState('');
    const [image, setImage] = useState('');
    const [loadMessage, setLoadMessage] = useState('Please wait');
    const [selectedPic, setSelectedPic] = useState({
        pic: 'https://res.cloudinary.com/kuinoso/image/upload/v1612556663/avatar_k6pn5r.png',
        loaded: false,
    });
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        img: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const spacebar = (e) => {
        if (location.pathname.includes('tetris') || location.pathname.includes('snake') || location.pathname.includes('2048')) {
            if (e.keyCode === 32) {
                setForm({
                    ...form,
                    [e.target.name]: e.target.value + ' ',
                });
            };
        };
    };

    const handleNewImage = (e) => {
        setSelectedPic({
            pic: URL.createObjectURL(e.target.files[0]),
            loaded: true,
        });

        setImage(e.target.files[0]);
    };

    const validateName = () => {
        if (validateEmail() && validatePassword() && comparePasswords()) {
            return form.name.length > 0;
        };
        return true;
    };

    const validateEmail = () => {
        return /\S+@\S+\.\S+/.test(form.email);
    };

    const validatePassword = () => {
        const regex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.{6,})");

        return regex.test(form.password);
    };

    const comparePasswords = () => {
        return passwordCheck === form.password;
    };

    const validateForm = () => {
        return validateEmail() && validatePassword() && comparePasswords() && validateName();
    };

    const resetState = () => {
        setLoading(false);

        setPasswordCheck('');

        setImage('');

        setSelectedPic({
            pic: 'https://res.cloudinary.com/kuinoso/image/upload/v1612556663/avatar_k6pn5r.png',
            loaded: false,
        });

        setForm({
            name: '',
            email: '',
            password: '',
            img: '',
        });

        setLoadMessage('Please wait');
    };

    const refreshUsers = () => {
        axios.get('/api/allUsers')
            .then(res => {
                dispatch(getAllUsers(res.data));
            })
            .catch(err => console.log(err));
    };

    const getData = (user) => {
        axios.get(`/api/user/${user}`)
            .then(res => {
                dispatch(getUserData(res.data));
            })
            .catch(err => console.log(err));
    };

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    const displayMessage = () => {
        setTimeout(function () { setLoadMessage('Setting up the arcade...') }, 5000);
        setTimeout(function () { setLoadMessage('Please wait') }, 10000);
        setTimeout(function () { setLoadMessage('Uploading picture...') }, 15000);
        setTimeout(function () { setLoadMessage('Please wait') }, 20000);
        setTimeout(function () { setLoadMessage('Finishing final details...') }, 25000);
    };

    const handleSubmit = () => {
        setLoading(true);

        displayMessage();

        if (selectedPic.loaded) {
            const data = new FormData();

            data.append('file', image);
            data.append('upload_preset', 'arkaven');
            data.append('cloud_name', 'kuinoso');

            axios.post('https://api.cloudinary.com/v1_1/kuinoso/image/upload', data)
                .then(res => {
                    const user = {
                        name: toTitleCase(form.name),
                        email: form.email.toLowerCase(),
                        password: form.password,
                        img: res.data.url,
                    };

                    axios.post('/api/newUser', user)
                        .then((res) => {
                            resetState();

                            closeModal();

                            refreshUsers();

                            dispatch(getLoggedUser(res.data));

                            getData(res.data);

                            dispatch(logIn());

                            Swal.fire({
                                icon: 'success',
                                text: 'Welcome to Arkaven!',
                            }).then(() => history.go(0));
                        })
                        .catch(err => {
                            setLoading(false);
                            setLoadMessage('Please wait');

                            closeModal();

                            Swal.fire({
                                icon: 'error',
                                text: err.response.data.errorMessage,
                            })
                                .then(() => openModal())
                                .catch(err => console.log(err));
                        });
                })
                .catch(err => {
                    console.log(err);
                });

        } else {
            const user = {
                name: toTitleCase(form.name),
                email: form.email,
                password: form.password,
                img: selectedPic.pic,
            };

            axios.post('/api/newUser', user)
                .then((res) => {
                    resetState();

                    closeModal();

                    refreshUsers();

                    dispatch(getLoggedUser(res.data));

                    getData(res.data);

                    dispatch(logIn());

                    Swal.fire({
                        icon: 'success',
                        text: 'Welcome to Arkaven!',
                    }).then(() => history.go(0));
                })
                .catch(err => {
                    console.log(err);

                    setLoading(false);
                    setLoadMessage('Please wait');

                    closeModal();

                    Swal.fire({
                        icon: 'error',
                        text: err.response.data.errorMessage,
                    })
                        .then(() => openModal())
                        .catch(err => console.log(err));
                });
        };
    };

    return (
        <div className={classes.container}>
            <div className={classes.rightDiv}>
                <video className={classes.background} autoPlay loop muted>
                    <source src={back} type="video/mp4" />
                </video>
                <div className={classes.textWrapper}>
                    <h1 className={classes.title}>PLAY THE CLASSICS</h1>
                </div>
                <div className={classes.textWrapper}>
                    <h1 className={classes.title}>RULE THE ARCADE</h1>
                </div>
            </div>
            <div
                onKeyDown={(e) => {
                    if (e.keyCode === 13 && validateForm()) {
                        handleSubmit();
                    };
                }}
            >
                <div className={classes.headerContainer}>
                    <h2 className={classes.header}>Join Arkaven</h2>
                    <p className={classes.subHeader}>
                        Already a member?
                            <span className={classes.subLink} onClick={() => changeModal('login')}> Log In</span>
                    </p>
                </div>
                <div className={classes.imageContainer}>
                    <img src={selectedPic.pic} alt='upload' className={classes.image} />
                    <input
                        type="file"
                        onChange={handleNewImage}
                        id="img"
                        name="img"
                        accept="image/*"
                        className={classes.fileInput}
                        ref={ref1}
                    />
                    <AddCircleOutlineIcon
                        onClick={() => { ref1.current.click() }}
                        className={classes.fileButton}
                    />
                </div>
                <div className={classes.fieldsContainer}>
                    <div className={classes.textDiv}>
                        <TextField
                            label="Name"
                            name='name'
                            value={form.name}
                            className={classes.textField}
                            onChange={handleChange}
                            onKeyDown={spacebar}
                        />
                        {!validateName() &&
                            <span className={classes.error}>Please enter a name</span>
                        }
                    </div>
                    <div className={classes.textDiv}>
                        <TextField
                            label="Email"
                            name='email'
                            value={form.email}
                            className={classes.textField}
                            onChange={handleChange}
                        />
                        {!validateEmail() && form.email.length > 0 &&
                            <span className={classes.error}>Please enter a valid email</span>
                        }
                    </div>
                    <div className={classes.textDiv}>
                        <TextField
                            label="Password"
                            name='password'
                            value={form.password}
                            type='Password'
                            className={classes.textField}
                            onChange={handleChange}
                        />
                        {!validatePassword() && form.password.length > 0 &&
                            <span className={classes.error}>Min 6 characters (letters and numbers)</span>
                        }
                    </div>
                    <div className={classes.textDiv}>
                        <TextField
                            label="Confirm password"
                            value={passwordCheck}
                            type='Password'
                            className={classes.textField}
                            onChange={(e) => {
                                setPasswordCheck(e.target.value);
                            }}
                        />
                        {!comparePasswords() && passwordCheck.length > 0 &&
                            <span className={classes.error}>Passwords do not match</span>
                        }
                    </div>
                    {loading ?
                        <div className={classes.load}>
                            <CircularProgress className={classes.loading} />
                            <p className={classes.message}>{loadMessage}</p>
                        </div>
                        :
                        <Button
                            variant="contained"
                            disabled={!validateForm()}
                            className={classes.login}
                            onClick={handleSubmit}
                        >
                            Join
                    </Button>
                    }
                </div>
            </div>
        </div>
    );
};