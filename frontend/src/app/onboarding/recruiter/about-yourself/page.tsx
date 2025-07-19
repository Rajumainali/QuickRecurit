import React, { useState, type ChangeEvent,useEffect } from "react";
import { Upload, Calendar, User, ChevronDown, Check, Moon, Sun } from "lucide-react";
import { toast } from "react-hot-toast";
import { frameData } from "motion/react";

const steps = ["About yourself", "Address", "certificate"];

const sectorOptions = [
  "IT", "Healthcare", "Finance", "Education", "Manufacturing", 
  "Retail", "Construction", "Transportation", "Agriculture", "Tourism"
];


type FormData = {
  CompanyName: string;
  RecuriterName: string;
  CompanyPhone: string;
  companyWebsite: string;
  sectors: string[];
  designation: string;
  CompanyDescription: string;
  province: string;
  city: string;
  postalCode: string;
  currentAddress: string;
  certificate: File | null;
  logo: File | null;
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

type MultiStepFormProps = {
  onSuccess: () => void;
  from: string;
};

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSuccess, from }) => {

  console.log(from)
  const [step, setStep] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    CompanyName: "",
    RecuriterName: "",
    CompanyPhone: "",
    companyWebsite: "",
    sectors: [],
    designation: "",
    CompanyDescription: "",
    province: "",
    city: "",
    postalCode: "",
    currentAddress: "",
    certificate: null,
    logo:null,
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

  const [logoImage, setlogoImage] = useState<string | null>(null);

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
        certificate: e.target.files![0],
      }));
    }
  };

const handlelogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        logo: e.target.files![0],
      }));
    const imageUrl = URL.createObjectURL(file);
    setlogoImage(imageUrl);
  }
};
const API_BASE_URL = import.meta.env.VITE_API_URL;


const handleSubmit = async () => {
 try {
  const token = localStorage.getItem("token");
  if (!token) return;

  const form = new FormData();
  form.append("CompanyName", formData.CompanyName);
  form.append("RecuriterName", formData.RecuriterName);
  form.append("CompanyPhone", formData.CompanyPhone);
  form.append("companyWebsite", formData.companyWebsite);
  form.append("designation", formData.designation);
  form.append("CompanyDescription", formData.CompanyDescription);
  form.append("province", formData.province);
  form.append("city", formData.city);
  form.append("postalCode", formData.postalCode);
  form.append("currentAddress", formData.currentAddress);
  formData.sectors.forEach((sector, i) => {
    form.append(`sectors[${i}]`, sector);
  });
  if (formData.logo) form.append("logo", formData.logo);
  if (formData.certificate) form.append("certificate", formData.certificate);

  // Debug FormData contents
  for (const [key, value] of form.entries()) {
    console.log(`${key}:`, value);
  }

  try {
        const isUpdate = from === "updateRecruiter";
        const endpoint = isUpdate ? "update-recruiter-details" : "recruiter-add-details";
        const method = isUpdate ? "PUT" : "POST";
  
    const res = await fetch(`${API_BASE_URL}auth/${endpoint}`, {
      method,
      headers: {
        Authorization: token, // Do not set Content-Type for FormData
      },
      body: form,
    });
  
    const data = await res.json();
  
    if (res.ok) {
      const successMessage = isUpdate ? "Details updated successfully!" : "Details submitted!";
      console.log(successMessage, data);
      toast.success(data.message || successMessage);
      onSuccess();
    } else {
      console.error("Submission failed:", data.message);
      toast.error(data.message || "Failed to submit details");
    }
  } catch (err) {
    console.error("Error submitting details:", err);
    toast.error("Something went wrong!");
  }

} catch (err) {
  console.error("Error submitting details:", err);
  toast.error("Something went wrong!");
}

};

useEffect(() => {
  const fetchDetails = async () => {
    if (from === "updateRecruiter") {
      const token = localStorage.getItem("token");
            if (!token) {
        throw new Error("No token found");
      }
      try {
        const res = await fetch(`${API_BASE_URL}auth/get-user-details`, {
        headers: {
          Authorization: token, // Do not set Content-Type for FormData
        },
        });

        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            ...data.details,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  fetchDetails();

}, [from]);



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
      {logoImage || formData.logo ? (
        <img
          src={logoImage || `${API_BASE_URL}upload/logos/${formData.logo}`}
          alt="logo Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
      )}
    </div>
    <label
      htmlFor="logo-upload"
      className="text-red-500 cursor-pointer hover:text-red-600"
    >
      Upload your company logo or Profile Image 
    </label>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      id="logo-upload"
      onChange={handlelogoUpload}
    />
  </div>
</div>


            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Company Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="CompanyName"
                  value={formData.CompanyName}
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
                 Recuriter Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="RecuriterName"
                  value={formData.RecuriterName}
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
                  Company Phone<span className="text-red-500">*</span>
                </label>
                <input
                  name="CompanyPhone"
                  value={formData.CompanyPhone}
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
                  Company Website Link<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="companyWebsite"
                    type="text"
                    value={formData.companyWebsite}
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
                  <option>---Select Province---</option>
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
                  <option>---Select District---</option>
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
              certificate
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
                  Upload certificate
                </button>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Note: Can only be used to verify
                </p>
                <label
                  htmlFor="certificate-upload"
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Choose File
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="certificate-upload"
                />

                {formData.certificate && (
                  <p className="mt-2 text-sm text-green-500">
                    File selected: {formData.certificate.name || `${formData.certificate}`}
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