import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    region: '',
    district: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const regions = [
    { value: 'ashanti', label: 'Ashanti' },
    { value: 'greater-accra', label: 'Greater Accra' },
    { value: 'western', label: 'Western' },
    { value: 'eastern', label: 'Eastern' },
    { value: 'central', label: 'Central' },
    { value: 'northern', label: 'Northern' },
    { value: 'upper-east', label: 'Upper East' },
    { value: 'upper-west', label: 'Upper West' },
    { value: 'volta', label: 'Volta' },
    { value: 'bono', label: 'Bono' },
  ];

  const districts = {
    ashanti: [
      { value: 'kumasi', label: 'Kumasi' },
      { value: 'ejisu', label: 'Ejisu' },
      { value: 'mampong', label: 'Mampong' },
    ],
    'greater-accra': [
      { value: 'accra', label: 'Accra' },
      { value: 'tema', label: 'Tema' },
      { value: 'madina', label: 'Madina' },
    ],
    western: [
      { value: 'takoradi', label: 'Takoradi' },
      { value: 'tarkwa', label: 'Tarkwa' },
    ],
    eastern: [
      { value: 'koforidua', label: 'Koforidua' },
      { value: 'nsawam', label: 'Nsawam' },
    ],
    central: [
      { value: 'cape-coast', label: 'Cape Coast' },
      { value: 'winneba', label: 'Winneba' },
    ],
    northern: [
      { value: 'tamale', label: 'Tamale' },
      { value: 'yendi', label: 'Yendi' },
    ],
    'upper-east': [
      { value: 'bolgatanga', label: 'Bolgatanga' },
      { value: 'bawku', label: 'Bawku' },
    ],
    'upper-west': [
      { value: 'wa', label: 'Wa' },
      { value: 'lawra', label: 'Lawra' },
    ],
    volta: [
      { value: 'ho', label: 'Ho' },
      { value: 'keta', label: 'Keta' },
    ],
    bono: [
      { value: 'sunyani', label: 'Sunyani' },
      { value: 'techiman', label: 'Techiman' },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phoneNumber,
            region: formData.region,
            district: formData.district,
            address: formData.address,
          },
        },
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Your Account</h1>
      <p>Join our community and start your journey</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
          {errors.firstName && <span className="error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label>Region</label>
          <select name="region" value={formData.region} onChange={handleChange}>
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
          {errors.region && <span className="error">{errors.region}</span>}
        </div>

        <div className="form-group">
          <label>District</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!formData.region}
          >
            <option value="">Select a district</option>
            {formData.region &&
              districts[formData.region].map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
          </select>
          {errors.district && <span className="error">{errors.district}</span>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm; 