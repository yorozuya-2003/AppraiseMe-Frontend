import axios from 'axios';
import React, {useEffect, useState } from 'react';
import "../styles/add_experience.css";
import API_BASE_URL from "./ApiConfig"
import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from './delete.svg';
import { ReactComponent as AddIcon } from './add.svg';
import Select from 'react-select';

function AddExperience() {
    let loggedInUser = JSON.parse(localStorage.getItem("user"));
    let loggedInUserObject =loggedInUser.email;


    const [models, setModels] = useState([]);
    const fetchData = () => {
        axios.get(`${API_BASE_URL}/api/addwork/?email=${loggedInUserObject}`)
            .then(response => {
            setModels(response.data);
            // console.log(response.data);
        })
            .catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        fetchData();
    }, [loggedInUserObject]);

    const [formData, setFormData] = useState({
        email:loggedInUserObject,
        title: '',
        emp_type:'Full-time',
        company: '',
        location:'',
        location_type:'On-site',
        currently_working:1,
        start_time:'',
        end_time:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(formData);
        setFormData({...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isAnyFieldEmpty = Object.values(formData).some(field => field === '');

        if (isAnyFieldEmpty) {
            console.error('Error: All fields must be filled');
            return;
        }

        try {
            console.log(formData)
            axios.post(`${API_BASE_URL}/api/addwork/`, formData)
            .then(response => {
                console.log('Experience added successfully:', response.data);
                setFormData({
                    email:loggedInUserObject,
                    title: '',
                    emp_type:'Full-time',
                    company: '',
                    location:'',
                    location_type:'On-site',
                    currently_working:1,
                    start_time:'',
                    end_time:'',
                });
                fetchData();
            })
            .catch(error => {
                console.log('Error adding Work:', error);
            })
        } catch (error) {
            console.error('Error Adding Work:', error);
        }
    };

    

    const [isAddDivVisible, setIsAddDivVisible] = useState(false);

    const toggleAddDiv = () => {
        setIsAddDivVisible(!isAddDivVisible);
    };

    const buttonLabel1 = isAddDivVisible ? 'Not needed' : 'Add more';
    const buttonLabel2 = isAddDivVisible ? '' : 'Work Experience';

    const handleDelete = (index) => {
        // console.log(models[index]);
        axios.delete(`${API_BASE_URL}/api/addwork/`, { data: models[index] })
        .then(response => {
            if (response.status === 200) {
                // Update your local state to reflect the deletion
                const updatedModels = [...models];
                updatedModels.splice(index, 1);
                setModels(updatedModels);
            }
        })
        .catch(error => {
            console.error('Error deleting item', error);
        });
    };

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

    function convertDateRange(startDate, endDate){
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startMonth = start.toLocaleString('default', { month: 'short' });
        const endMonth = end.toLocaleString('default', { month: 'short' });

        const formattedStartDate = `${startMonth} ${start.getFullYear()}`;
        const formattedEndDate = `${endMonth} ${end.getFullYear()}`;

        const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;

        const durationString = `${years > 0 ? years + ' year' + (years > 1 ? 's' : '') : ''}${(years > 0 && months > 0) ? ' ' : ''}${months > 0 ? months + ' month' + (months > 1 ? 's' : '') : (years === 0 && months === 0) ? '1 month' : ''}`;

        return `${formattedStartDate} - ${formattedEndDate} · ${durationString}`;
    }

    return (
    <div className="addexp">
      <h1>👔 Add any previous employment history</h1>
        
      {models.map((model, index) => (
            <div className="addexp-box">
                <p className="exp-num">Work Experience {index+1}</p>
                <div className='exp-details'>
                    <p style={{fontWeight: "700"}}>{model.title}</p>
                    <p>{model.company} · {model.emp_type}</p>
                    <p>{convertDateRange(model.start_time, model.end_time)}</p>
                    <p>{model.location} · {model.location_type}</p>
                </div>
                <div className="edit-delete-btns">
                    <button className='edit-exp-btn'>Edit</button>
                    <button onClick={() => handleDelete(index)} className="delete-exp-btn"><DeleteIcon /></button>
                </div>
            </div>
      ))}
      
      <div className="addexp-box" id="add_div" style={{ display: isAddDivVisible ? 'block' : 'none' }}>
        <div className="addexp-box-contents">
        <form onSubmit={handleSubmit} className="addexp-form" action="">
            <div className="add-exp-form-section title">
                <input
                type="text" name='title' value={formData.title} onChange={handleChange} placeholder="Title" autoComplete='off'/>
            </div>

            <div className="add-exp-form-section">

                <Select
                    value={{ label: formData.emp_type, value: formData.emp_type }}
                    onChange={(selectedOption) =>
                        setFormData({ ...formData, emp_type: selectedOption.value })
                    }
                    options={[
                        { label: 'Full-time', value: 'Full-time' },
                        { label: 'Part-time', value: 'Part-time' },
                    ]}
                    styles={selectStyles}
                />

                <input
                type="text" name='company' value={formData.company} onChange={handleChange} placeholder="Company Name" autoComplete='off'/>
            </div>

            <div className="add-exp-form-section">
                <input
                type="text" name='location' value={formData.location} onChange={handleChange} placeholder="Location" autoComplete='off'/>

                    <Select
                        value={{ label: formData.location_type, value: formData.location_type }}
                        onChange={(selectedOption) =>
                            setFormData({
                            ...formData,
                            location_type: selectedOption.value,
                            })
                        }
                        options={[
                            { label: 'On-site', value: 'On-site' },
                            { label: 'Hybrid', value: 'Hybrid' },
                            { label: 'Remote', value: 'Remote' },
                        ]}
                        styles={selectStyles}
                    />
            </div>

            <div className="add-exp-form-section">
                <div style={{display:'flex',flexDirection:'column'}}>
                    <label htmlFor="" style={{marginLeft:'15px'}}>Start Time</label>
                    <input
                        type="date" name='start_time' value={formData.start_time} onChange={handleChange}/>
                </div>

                <div style={{display:'flex',flexDirection:'column'}}>
                    <label htmlFor="" style={{marginLeft:'15px', marginDown:'20px'}}>End Time</label>
                <input
                    type="date" name='end_time' value={formData.end_time} onChange={handleChange}/>
                </div>
            </div>

            <div className="continue">
              <button className="continue-btn" type="submit">
                Add Work
              </button>
            </div>
          </form>
        </div>
      </div>
        <button onClick={toggleAddDiv} className='addbutton' id="addbutton">
            <div className="add-btn-text">
                {buttonLabel1}
                <br />
                {buttonLabel2}
            </div>
            { buttonLabel1 !== 'Not needed' && (
                <div className='add-icon'>
                    <AddIcon />
                </div>
            )}
        </button>
        
        <Link style={{textDecoration: 'none'}} to='/home'>
            <button className="continue-btn" type="submit">
                Continue
            </button>
        </Link>
    </div>
  );
}

export default AddExperience;
