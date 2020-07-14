import React, { useState } from 'react';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { connect } from 'react-redux';
import { compress } from 'image-conversion';

import './form.scss';
import Spinner from './../Spinner/Spinner';
import {
  signUpUser,
  logInUser,
  createJob,
  createCategory,
  editUser,
  editPassword,
  editJob,
  getJobCategories,
  getAdmin,
} from './../../actions/actions';

const Field = (props) => {
  const { label, name, type, id, required } = props;
  const [error, setError] = useState(null);

  const handleValue = (e) => {
    const deadline = new Date(e.target.value).getTime();
    const now = Date.now();

    if (e.target.name === 'deadline' && deadline < now) {
      setError('Deadline cannot be in past.  Please provide new date!');
    } else {
      setError(null);
    }
  };
  return (
    <div className="popover-form-control">
      <label htmlFor="confirmPassword" className="popover-form-control__label">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="popover-form-control__input"
        placeholder={label}
        autoComplete="off"
        id={id}
        onChange={props.handleChange}
        required={required ? 'required' : ''}
        onBlur={handleValue}
      />
      {error ? (
        <span className="popover-form-control__error" style={{ color: 'red' }}>
          {error}
        </span>
      ) : null}
    </div>
  );
};

const SelectOption = (props) => {
  return (
    <div className="popover-form-control">
      <label htmlFor={props.name} className="popover-form-control__label">
        {props.label}
      </label>
      <select
        name={props.name}
        className="popover-form-control__input"
        onChange={props.handleChange}
        required={props.required ? 'required' : ''}
      >
        {props.options.map((option, i) => {
          return (
            <option value={option} key={i}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.formName = this.props.formName;

    this.editJob =
      this.props.match &&
      this.props.match.path &&
      this.props.match.path.includes('/jobs/edit')
        ? true
        : false;
    this.state = {};
  }
  componentDidMount() {
    this.props.getJobCategories();
    this.props.getAdmin();
  }

  compressImage = async (image) => {
    const compressedImage = await compress(image, {
      quality: image.size > 5000000 ? 0.6 : 0.8,
      type: 'image/jpeg',
      width: 500,
      height: 500,
      scale: 0.5,
    });
    const compressedFile = new File([compressedImage], `${image.name}`, {
      type: compressedImage.type,
    });

    return compressedFile;
  };

  register = () => {
    return (
      <React.Fragment>
        <Field
          type="email"
          name="email"
          label="Email "
          handleChange={this.handleChange}
          required
        />
        <Field
          type="text"
          name="userName"
          label="Username/Companyname"
          handleChange={this.handleChange}
        />
        <Field
          type="password"
          name="password"
          label="Password"
          handleChange={this.handleChange}
          required
        />
        <Field
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          id="confirmPassword"
          handleChange={this.handleChange}
          required
        />
        {!this.props.admin ? (
          <SelectOption
            label="Role"
            name="role"
            options={['admin', 'employee', 'employer']}
            handleChange={this.handleChange}
          />
        ) : null}
        {this.formName === 'candidateSignUpForm' ? (
          <React.Fragment>
            <Field
              type="text"
              name="phone"
              label="Phone Number "
              handleChange={this.handleChange}
              required
            />
            <Field
              type="file"
              name="resume"
              label="Resume "
              handleChange={this.handleChange}
              // required
            />
          </React.Fragment>
        ) : null}
        {this.formName === 'employerSignUpForm' ? (
          <React.Fragment>
            <Field
              type="text"
              name="phone"
              label="Phone Number "
              handleChange={this.handleChange}
              required
            />
            <Field
              type="text"
              name="companyAddress"
              label="Organization Address"
              handleChange={this.handleChange}
              required
            />
            <Field
              type="text"
              name="companyDescription"
              label="Organization Description"
              handleChange={this.handleChange}
              required
            />
          </React.Fragment>
        ) : null}
        <Field
          type="file"
          name="image"
          label="Profile Image "
          handleChange={this.handleChange}
          required
        />
      </React.Fragment>
    );
  };
  logIn = () => {
    return (
      <React.Fragment>
        <Field
          type="email"
          name="email"
          label="Email "
          handleChange={this.handleChange}
          required
        />
        <Field
          type="password"
          name="password"
          label="Password"
          handleChange={this.handleChange}
          required
        />
      </React.Fragment>
    );
  };

  editForm = () => {
    return (
      <React.Fragment>
        <Field
          type="email"
          name="email"
          label="Email "
          handleChange={this.handleChange}
        />

        <Field
          type="text"
          name="phone"
          label="Phone Number "
          handleChange={this.handleChange}
        />
        {this.props.user && this.props.user.role === 'admin' && (
          <Field
            type="text"
            name="userName"
            label="Username"
            handleChange={this.handleChange}
          />
        )}

        {this.props.user && this.props.user.role === 'employee' && (
          <>
            <Field
              type="text"
              name="userName"
              label="Username"
              handleChange={this.handleChange}
            />
            <Field
              type="file"
              name="resume"
              label="Resume"
              handleChange={this.handleChange}
            />
          </>
        )}
        {this.props.user && this.props.user.role === 'employer' && (
          <>
            <Field
              type="text"
              name="userName"
              label="Comapanyname"
              handleChange={this.handleChange}
            />
            <Field
              type="text"
              name="companyAddress"
              label="Organization Address"
              handleChange={this.handleChange}
            />
            <Field
              type="text"
              name="companyDescription"
              label="Organization Description"
              handleChange={this.handleChange}
            />
          </>
        )}
        <Field
          type="file"
          name="image"
          label="Image"
          handleChange={this.handleChange}
        />
      </React.Fragment>
    );
  };

  createJobForm = (props) => {
    return (
      <React.Fragment>
        <Field
          type="text"
          name="name"
          label="Name"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <Field
          type="text"
          name="address"
          label="Address"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <Field
          type="text"
          name="salary"
          label="Salary"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <SelectOption
          label="Type"
          name="type"
          options={['Select Type', 'Full Time', 'Part Time', 'Internship']}
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <SelectOption
          label="Category"
          name="category"
          options={
            this.props.categories
              ? this.props.categories.map((category) => category.name)
              : ['select catgory']
          }
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />

        <Field
          type="text"
          name="jobDescription"
          label="Description"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />

        <Field
          type="text"
          name="education"
          label="Education"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <SelectOption
          label="Level"
          name="level"
          options={['Select Level', 'Beginner', 'Intermediate', 'Expert']}
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <Field
          type="date"
          name="deadline"
          label="Deadline"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
          //handle data as well
        />
        <Field
          type="text"
          name="experience"
          label="Experience"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <Field
          type="text"
          name="numPositions"
          label="Number of Positions"
          handleChange={this.handleChange}
          required={props === 'edit' ? '' : 'required'}
        />
        <Field
          type="file"
          name="image"
          label="Image"
          handleChange={this.handleChange}
        />
      </React.Fragment>
    );
  };

  createCategoryForm = () => {
    return (
      <React.Fragment>
        <Field
          label="Category Name"
          name="name"
          type="text"
          handleChange={this.handleChange}
          required
        />
        <Field
          label="Add Icon/Image"
          name="image"
          type="file"
          handleChange={this.handleChange}
          required
        />
      </React.Fragment>
    );
  };

  employeeProfileForm = () => {
    return (
      <React.Fragment>
        <Field
          name="resume"
          label="Resume"
          type="file"
          handleChange={this.handleChange}
        />
      </React.Fragment>
    );
  };

  employerProfileForm = () => {
    return (
      <React.Fragment>
        <Field
          name="companyName"
          label="Company Name"
          type="text"
          handleChange={this.handleChange}
        />
        <Field
          name="companyAddress"
          label="Company Address"
          type="text"
          handleChange={this.handleChange}
        />
        <Field
          name="phone"
          label="Phone"
          type="text"
          handleChange={this.handleChange}
        />
        <Field
          name="companyDescription"
          label=" Company Decription"
          type="text"
          handleChange={this.handleChange}
        />
      </React.Fragment>
    );
  };

  editPasswordForm = () => {
    return (
      <React.Fragment>
        <Field
          label="Current Password"
          type="password"
          name="password"
          handleChange={this.handleChange}
          required
        />
        <Field
          label="New Password"
          type="password"
          name="newPassword"
          handleChange={this.handleChange}
          required
        />
        <Field
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          handleChange={this.handleChange}
          required
        />
      </React.Fragment>
    );
  };

  setFormTitle = () => {
    if (this.formName === 'login__handle') {
      return 'Login Here';
    } else if (this.formName === 'register__handle') {
      return 'SignUp Here';
    } else if (this.formName === 'editForm') {
      return 'Edit User';
    } else if (this.formName === 'createJob') {
      return 'Create Job';
    } else if (this.formName === 'createCategory') {
      return 'Create Category';
    } else if (this.formName === 'editPassword') {
      return 'Edit Password';
    } else if (this.editJob) {
      return 'Edit Job';
    } else if (this.formName === 'candidateSignUpForm') {
      return 'Register As Candidate';
    } else if (this.formName === 'employerSignUpForm') {
      return 'Register As EMployer';
    }
  };

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.files
        ? event.target.files[0]
        : event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let data = {};
    if (this.state.image) {
      const compressedImage = await this.compressImage(this.state.image);
      data = { ...this.state, image: compressedImage };
    } else {
      data = { ...this.state };
    }

    if (
      this.formName === 'register__handle' ||
      this.formName === 'candidateSignUpForm' ||
      this.formName === 'employerSignUpForm'
    ) {
      if (this.formName === 'candidateSignUpForm') {
        data = { ...this.state, role: 'employee' };
      } else if (this.formName === 'employerSignUpForm') {
        data = { ...this.state, role: 'employer' };
      }
      if (this.formName === 'register__handle') {
        this.props.signUpUser(data);
        this.props.handleClose();
      }
    } else if (this.formName === 'login__handle') {
      this.props.logInUser(data);
      this.props.handleClose();
    } else if (this.formName === 'createJob') {
      this.props.createJob(data);
    } else if (this.formName === 'createCategory') {
      this.props.createCategory(data);
    } else if (this.formName === 'editForm') {
      this.props.editUser(data, this.props.user._id);
    } else if (this.formName === 'editPassword') {
      this.props.editPassword(data, this.props.user._id);
    } else if (
      this.formName === 'employerForm' ||
      this.formName === 'employeeForm'
    ) {
      this.props.editUser(data, this.props.user._id);
    } else if (this.editJob) {
      //if job get here donot rate it in the backend
      const jobId = this.props.match.params.id;
      this.props.editJob(data, jobId);
    }
  };

  renderSubmitButtonLabel = () => {
    if (this.formName === 'register__handle') {
      return 'SignUp Here ';
    } else if (this.formName === 'login__handle') {
      return 'Log In';
    } else if (this.formName === 'editForm') {
      return 'Edit User';
    } else if (this.formName === 'createJob' && !this.editJob) {
      return 'Create Job ';
    } else if (this.formName === 'createCategory') {
      return 'Create Category';
    } else if (this.formName === 'editPassword') {
      return 'Edit Password';
    } else if (
      this.formName === 'employerForm' ||
      this.formName === 'employeeForm'
    ) {
      return 'Complete Profile';
    } else if (this.editJob) {
      return 'Edit Job';
    } else if (
      this.formName === 'candidateSignUpForm' ||
      this.formName === 'employerSignUpForm'
    ) {
      return 'Register';
    }
  };

  render() {
    if (this.props.loading) {
      return <Spinner />;
    } else {
      return (
        <div className="popover-container">
          <h3 className="form-heading">{this.setFormTitle()}</h3>
          <form className="popover-form" onSubmit={this.handleSubmit}>
            {this.formName === 'editForm' ||
            this.formName === 'login__handle' ||
            this.formName === 'employerForm' ||
            this.editJob ||
            this.formName === 'createCategory' ||
            this.formName === 'editPassword' ||
            this.formName === 'candidateSignUpForm' ||
            this.formName === 'employerSignUpForm' ||
            this.formName === 'employeeForm' ||
            !this.props.admin ||
            this.formName === 'createJob' ? null : (
              <div className="popover-form-control popover-form-control--role ">
                <div
                  className={`popover-form-control__radio ${
                    this.state.role === 'employee' || this.state.role === null
                      ? 'active'
                      : null
                  }`}
                >
                  <label htmlFor="employee">
                    <PermIdentityIcon color="inherit" fontSize="default" />
                    Employee
                  </label>
                  <input
                    type="radio"
                    name="role"
                    value="employee"
                    id="employee"
                    onChange={this.handleChange}
                  />
                </div>
                <div
                  className={`popover-form-control__radio ${
                    this.state.role === 'employer' ? 'active' : null
                  }`}
                >
                  <label htmlFor="employer">
                    <PermIdentityIcon color="inherit" fontSize="default" />
                    Employer
                  </label>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    id="employer"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            )}

            {this.formName === 'register__handle' ? this.register() : null}
            {this.formName === 'editForm' ? this.editForm() : null}
            {this.formName === 'login__handle' ? this.logIn() : null}
            {this.formName === 'createJob' ? this.createJobForm() : null}
            {this.formName === 'editPassword' ? this.editPasswordForm() : null}
            {this.formName === 'employerForm'
              ? this.employerProfileForm()
              : null}
            {this.formName === 'employeeForm'
              ? this.employeeProfileForm()
              : null}
            {this.editJob ? this.createJobForm('edit') : null}
            {this.formName === 'candidateSignUpForm' ? this.register() : null}
            {this.formName === 'employerSignUpForm' ? this.register() : null}
            {this.formName === 'createCategory'
              ? this.createCategoryForm()
              : null}
            <button className="popover-form__submit" type="submit">
              {this.renderSubmitButtonLabel()}
            </button>
          </form>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user.currentUser,
    categories: state.job.category,
    admin: state.user.admin,
    loading: state.loader.loading,
  };
};

export default connect(mapStateToProps, {
  signUpUser,
  logInUser,
  createJob,
  createCategory,
  editUser,
  editPassword,
  editJob,
  getJobCategories,
  getAdmin,
})(Form);
