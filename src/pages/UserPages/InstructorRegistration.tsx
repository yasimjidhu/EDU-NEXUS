import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { toast } from "react-toastify";
import { Register } from "../../components/redux/slices/studentSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registrationFormSchema } from "../../utils/UserValidation";

const InstructorRegistration: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const validationSchema = registrationFormSchema();

  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    qualification: "btech",
    dob: "",
    gender: "male",
    profileImage: null as File | null,
    cv: null as File | null,
  };

  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFieldValue(field, e.target.files[0]);
    }
  };

  const handleEdit = (field: string) => {
    document.getElementById(field)?.click();
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    const uploadPresetProfile = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const uploadPresetCV = import.meta.env.VITE_CLOUDINARY_CV_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    try {
      let profileImageUrl = "";
      let cvUrl = "";

      if (values.profileImage) {
        const formDataUploadProfile = new FormData();
        formDataUploadProfile.append("file", values.profileImage);
        formDataUploadProfile.append("upload_preset", uploadPresetProfile);
        formDataUploadProfile.append("cloud_name", cloudName);

        const responseProfile = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formDataUploadProfile
        );
        profileImageUrl = responseProfile.data.secure_url;
      } else {
        toast.warning("Please select a profile image to upload");
      }

      if (values.cv) {
        const formDataUploadCV = new FormData();
        formDataUploadCV.append("file", values.cv);
        formDataUploadCV.append("upload_preset", uploadPresetCV);
        formDataUploadCV.append("cloud_name", cloudName);

        const responseCV = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          formDataUploadCV
        );
        cvUrl = responseCV.data.secure_url;
      } else {
        toast.warning("Please select a CV to upload");
      }

      const payload = {
        ...values,
        dob: new Date(values.dob),
        profileImage: profileImageUrl,
        cv: cvUrl,
        role: role,
      };

      const response = await dispatch(Register({ formData: payload })).unwrap();
      if (response) {
        toast.success("User Registered Successfully");
        navigate("/notVerified");
      } else {
        toast.error("Registration failed");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-start text-xl prime-sm">
        Instructor Registration Form
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Formik onSubmit called with values:", values);
          handleSubmit(values, { setSubmitting });
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="mt-2">
            <div className="bg-gray-300 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 rounded-xl px-8 py-2">
              <div className="p-4">
                <div className="mb-2">
                  <label htmlFor="firstName" className="block mb-1">
                    First Name
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="John"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="lastName" className="block mb-1">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="phone" className="block mb-1">
                    Phone
                  </label>
                  <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="9876543210"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="address" className="block mb-1">
                    Address
                  </label>
                  <Field
                    as="textarea"
                    name="address"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="4th street hyderabad"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>

                <div className="mb-2">
                  <input
                    type="file"
                    name="cv"
                    onChange={(e) => handleFileChange(e, setFieldValue, "cv")}
                    className="w-full p-2 border border-gray-300 rounded-md hidden"
                    id="cvInput"
                  />
                  <ErrorMessage
                    name="cv"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <button
                  type="button"
                  className="bg-hash-black w-full text-center py-2 px-4 mt-2 rounded-lg text-white"
                  onClick={() => handleEdit("cvInput")}
                >
                  Upload Cv
                </button>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-medium-rose py-2 px-4 rounded-lg mt-4 w-1/2 text-white hover:bg-strong-rose"
                  >
                    {loading ? (
                      <BeatLoader
                        color="white"
                        className="text-center text-lg"
                      />
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <Link to="/home" className="w-1/2">
                    <button
                      type="button"
                      className="bg-hash-black py-2 px-4 rounded-lg mt-4 w-full text-white hover:bg-lite-black"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </div>
              <div className="p-4 text-center">
                <input
                  type="file"
                  name="profileImage"
                  onChange={(e) =>
                    handleFileChange(e, setFieldValue, "profileImage")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md hidden"
                  id="profileImageInput"
                />
                <div className="rounded-full bg-blue-500 w-32 h-32 shadow-sm border-2 border-black m-auto overflow-hidden">
                  {values.profileImage ? (
                    <img
                      src={URL.createObjectURL(values.profileImage)}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/assets/png/user.png"
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  className="bg-hash-black border-2 border-medium-rose text-center py-1 px-4 mt-2 rounded-lg text-white"
                  onClick={() => handleEdit("profileImageInput")}
                >
                  Edit
                </button>
              
                <div className="mt-4">
                  <label htmlFor="dob" className="block mb-1 text-start">
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    name="dob"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="gender" className="block mb-1 text-start">
                    Gender
                  </label>
                  <div className="flex items-center space-x-4 mt-4">
                    <label className="inline-flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value="male"
                        className="form-radio cursor-pointer"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <Field
                        type="radio"
                        name="gender"
                        value="female"
                        className="form-radio cursor-pointer"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
                <div className="mt-8">
                  <label
                    htmlFor="qualification"
                    className="block mb-1 text-start"
                  >
                    Qualification
                  </label>
                  <Field
                    as="select"
                    name="qualification"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="btech">B.Tech</option>
                      <option value="mca">MCA</option>
                      <option value="bba">BBA</option>
                      <option value="bsc">B.Sc</option>
                      <option value="mba">MBA</option>
                      <option value="bcom">B.Com</option>
                      <option value="bs">Bachelor of Science (BS)</option>
                      <option value="ba">Bachelor of Arts (BA)</option>
                      <option value="bpharma">
                        Bachelor of Pharmacy (B.Pharm)
                      </option>
                      <option value="bds">
                        Bachelor of Dental Surgery (BDS)
                      </option>
                      <option value="bhm">
                        Bachelor of Hotel Management (BHM)
                      </option>
                      <option value="bfa">Bachelor of Fine Arts (BFA)</option>
                      <option value="llb">Bachelor of Laws (LLB)</option>
                      <option value="ca">Chartered Accountancy (CA)</option>
                      <option value="icwa">
                        Cost and Works Accountancy (ICWA)
                      </option>
                      <option value="diploma">Diploma</option>
                      <option value="iti">
                        Industrial Training Institute (ITI)
                      </option>
                      <option value="secondary">
                        Secondary School (10th Grade)
                      </option>
                      <option value="higher_secondary">
                        Higher Secondary (12th Grade)
                      </option>
                      <option value="other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="qualification"
                    component="div"
                    className="text-red-600 mt-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InstructorRegistration;
