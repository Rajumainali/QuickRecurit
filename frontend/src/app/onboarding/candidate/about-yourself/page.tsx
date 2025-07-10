import React, { useState, type ChangeEvent } from "react";
import { Upload, Calendar, User, ChevronDown, Check, Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";

const steps = ["About yourself", "Address", "Resume"];

const sectorOptions = [
  "IT", "Healthcare", "Finance", "Education", "Manufacturing", 
  "Retail", "Construction", "Transportation", "Agriculture", "Tourism"
];


type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  sectors: string[];
  designation: string;
  aboutMe: string;
  province: string;
  city: string;
  postalCode: string;
  currentAddress: string;
  resume: File | null;
  profile: File | null;
};

const SelectiveDropdown: React.FC<{ 
  selectedSectors: string[]; 
  onSectorChange: (sector: string) => void;
  isDarkMode: boolean;
}> = ({ selectedSectors, onSectorChange, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left border rounded-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <span className={selectedSectors.length === 0 ? (isDarkMode ? 'text-gray-400' : 'text-gray-500') : ''}>
          {selectedSectors.length === 0 
            ? 'Select sectors...' 
            : `${selectedSectors.length} sector${selectedSectors.length > 1 ? 's' : ''} selected`
          }
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </button>
      
      {isOpen && (
        <div className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-white border-gray-300'
        }`}>
          {sectorOptions.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => onSectorChange(sector)}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-opacity-80 ${
                isDarkMode
                  ? 'hover:bg-gray-600 text-white'
                  : 'hover:bg-gray-50 text-gray-900'
              }`}
            >
              <span>{sector}</span>
              {selectedSectors.includes(sector) && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MultiStepForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [step, setStep] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "Ujjwol",
    lastName: "Mainali",
    gender: "Male",
    dateOfBirth: "2002-07-08",
    sectors: ["IT"],
    designation: "MERN developer",
    aboutMe: "I am full stack developer.",
    province: "Bagmati",
    city: "Kathmandu",
    postalCode: "4400",
    currentAddress: "Kapan",
    resume: null,
    profile:null,
  });

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSectorChange = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        profile: e.target.files![0],
      }));
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  }
};
const API_BASE_URL = import.meta.env.VITE_API_URL;


const handleSubmit = async () => {
 try {
  const token = localStorage.getItem("token");
  if (!token) return;

  const form = new FormData();
  form.append("firstName", formData.firstName);
  form.append("lastName", formData.lastName);
  form.append("gender", formData.gender);
  form.append("dateOfBirth", formData.dateOfBirth);
  form.append("designation", formData.designation);
  form.append("aboutMe", formData.aboutMe);
  form.append("province", formData.province);
  form.append("city", formData.city);
  form.append("postalCode", formData.postalCode);
  form.append("currentAddress", formData.currentAddress);
  formData.sectors.forEach((sector, i) => {
    form.append(`sectors[${i}]`, sector);
  });
  if (formData.profile) form.append("profile", formData.profile);
  if (formData.resume) form.append("resume", formData.resume);

  // Debug FormData contents
  for (const [key, value] of form.entries()) {
    console.log(`${key}:`, value);
  }

  const res = await fetch(`${API_BASE_URL}auth/add-details`, {
    method: "POST",
    headers: {
      Authorization: token, // No Content-Type when sending FormData
    },
    body: form,
  });

  const data = await res.json();

  if (res.ok) {
  console.log("Details added successfully:", data);
  toast.success("Details submitted!");
  onSuccess()
  } else {
    console.error("Failed to submit details:", data.message);
    toast.error(data.message || "Failed to submit details");
  }
} catch (err) {
  console.error("Error submitting details:", err);
  toast.error("Something went wrong!");
}

};

  return (
    <div className={`w-full mx-auto p-8 h-[140vh] transition-colors ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Step Progress Bar */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  index <= step
                    ? isDarkMode 
                      ? "bg-blue-500 border-blue-500" 
                      : "bg-black border-black"
                    : isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                }`}
              />
              <span className={`text-xs mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-24 h-0.5 mx-4 ${
                  index < step 
                    ? isDarkMode ? "bg-blue-500" : "bg-black"
                    : isDarkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className={`rounded-lg shadow-sm p-8 transition-colors ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {step === 0 && (
          <>
            <h2 className={`text-2xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              About yourself
            </h2>
            <p className={`mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Fill out your primary information.
            </p>

            <div className="mb-8">
  <div className="flex items-center gap-4">
    <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
    }`}>
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
      )}
    </div>
    <label
      htmlFor="profile-upload"
      className="text-red-500 cursor-pointer hover:text-red-600"
    >
      Upload your Profile Picture
    </label>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      id="profile-upload"
      onChange={handleProfileUpload}
    />
  </div>
</div>


            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Gender<span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Date Of Birth<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <Calendar className={`absolute right-3 top-3.5 w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Sectors
                </label>
                <SelectiveDropdown 
                  selectedSectors={formData.sectors}
                  onSectorChange={handleSectorChange}
                  isDarkMode={isDarkMode}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Designation
                </label>
                <input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <div>
            <h2 className={`text-2xl font-semibold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Address
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Province<span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Bagmati">Bagmati</option>
                  <option value="Gandaki">Gandaki</option>
                  <option value="Lumbini">Lumbini</option>
                  <option value="Karnali">Karnali</option>
                  <option value="Sudurpashchim">Sudurpashchim</option>
                  <option value="Koshi">Koshi</option>
                  <option value="Madhesh">Madhesh</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  City<span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Postal Code
              </label>
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="mb-8">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Current Address<span className="text-red-500">*</span>
              </label>
              <input
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className={`text-2xl font-semibold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Resume
            </h2>

            <div className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex flex-col items-center">
                <Upload className={`w-12 h-12 mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <button className="text-blue-500 font-medium mb-2 hover:text-blue-600">
                  Upload Resume
                </button>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Note: Can only be used to apply for a job
                </p>
                <label
                  htmlFor="resume-upload"
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />

                {formData.resume && (
                  <p className="mt-2 text-sm text-green-500">
                    File selected: {formData.resume.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-8 gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className={`px-6 py-3 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;