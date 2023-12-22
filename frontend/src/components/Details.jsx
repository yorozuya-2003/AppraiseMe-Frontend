import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../styles/details.css';
import axios from 'axios';
import API_BASE_URL from './ApiConfig';
import { useNavigate } from 'react-router-dom';
import useCheckProfileCompletion from './checkProfileCompletion';

function Details() {
    useCheckProfileCompletion();
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem("user");
    const loggedInUserObject = JSON.parse(loggedInUser);

    const [formData, setFormData] = useState({
        Email: loggedInUserObject.email,
        First_name: '',
        Second_name: '',
        DOB: '',
        Gender: 'Male',
        Pronouns: 'He/Him',
        Image: null,
        Bio: null,
    });

    useEffect(() => {
        if (!loggedInUserObject) {
            navigate('/');
        } else {
            setFormData({ ...formData, Email: loggedInUserObject.email });
        }
    }, [loggedInUserObject]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleChange = (name, selectedOption) => {
      let updatedValue = "";
      if (name === 'DOB') {
        updatedValue = selectedOption
      } else {
        updatedValue =
            name === 'First_name' || name === 'Second_name' ? capitalizeFirstLetter(selectedOption) : selectedOption.value;
      };
        // console.log(formData);
        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isAnyFieldEmpty = Object.values(formData).some((field) => field === '');

        if (isAnyFieldEmpty) {
            console.error('Error: All fields must be filled');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/addprofile/`, formData);
            console.log('Details added:', response.data);
            setFormData({
                Email: loggedInUserObject.email,
                First_name: '',
                Second_name: '',
                DOB: '',
                Gender: 'Male',
                Pronouns: 'He/Him',
                Image: null,
                Bio: null,
            });
            navigate('/employment');
        } catch (error) {
            console.error('Error Adding Details:', error);
        }
    };

    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 3);
    const maxDateValue = currentDate.toISOString().split('T')[0];

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            width: '320px',
            height: '56px',
            borderRadius: '16px',
            border: '1px solid #d9d9d9',
            padding: '0px',
            paddingLeft: '16px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3818fd' : 'white',
            color: state.isSelected ? 'white' : '#4a4a4a',
            ':hover': {
                backgroundColor: state.isSelected ? '#3818fd' : '#f3f3f3',
                color: state.isSelected ? 'white' : '#4a4a4a',
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0px',
            margin: '0px',
        }),
        input: (provided) => ({
            ...provided,
            padding: '0px',
            margin: '0px',
        }),
    };

    return (
        <div className='details'>
            <h1>
                {' '}
                <img src="" alt=""/> 👋🏾 Tell us a <br /> little about yourself
            </h1>
            <form onSubmit={handleSubmit} className='details-form' action="">
                <div className='details-box'>
                    <div className='preferred-pronouns'>
                        <Select
                            name='Pronouns'
                            value={{ label: formData.Pronouns, value: formData.Pronouns }}
                            onChange={(selectedOption) => handleChange('Pronouns', selectedOption)}
                            options={[
                                { value: 'He/Him', label: 'He/Him' },
                                { value: 'She/Her', label: 'She/Her' },
                                { value: 'They/Them', label: 'They/Them' },
                                { value: 'Other', label: 'Other' },
                            ]}
                            styles={selectStyles}
                            placeholder={<div>Preferred Pronouns</div>}
                        />
                    </div>

                    <div className='names'>
                        <input
                            type='text'
                            placeholder='First Name'
                            name='First_name'
                            value={formData.First_name}
                            onChange={(e) => handleChange('First_name', e.target.value)}
                            autoComplete='off'
                        />
                        <input
                            type='text'
                            placeholder='Second Name'
                            name='Second_name'
                            value={formData.Second_name}
                            onChange={(e) => handleChange('Second_name', e.target.value)}
                            autoComplete='off'
                        />
                    </div>

                    <div className='dob-gender'>
                        <div className='dob'>
                            <input
                                type='date'
                                name='DOB'
                                max={maxDateValue}
                                value={formData.DOB}
                                onChange={(e) => handleChange('DOB', e.target.value)}
                            />
                        </div>

                        <Select
                            name='Gender'
                            value={{ label: formData.Gender, value: formData.Gender }}
                            onChange={(selectedOption) => handleChange('Gender', selectedOption)}
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                            ]}
                            styles={selectStyles}
                            placeholder={<div>Gender</div>}
                        />
                    </div>

                    <div className='continue'>
                        <button className='continue-btn' type='submit'>
                            Continue
                        </button>
                        <div className='faq-div'>
                            <h4>Have a question? See our FAQ </h4>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Details;
