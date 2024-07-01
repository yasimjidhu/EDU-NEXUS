import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/redux/store/store";
import { toast } from "react-toastify";
import { Register } from "../../components/redux/slices/studentSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { registrationFormSchema } from "../../utils/UserValidation";

const StudentRegistration: React.FC = () => {
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
  };

  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFieldValue("profileImage", e.target.files[0]);
    }
  };

  const handleEdit = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (values.profileImage) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", values.profileImage);
      formDataUpload.append("upload_preset", uploadPreset || "");
      formDataUpload.append("cloud_name", cloudName);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formDataUpload
        );
        const imageUrl = response.data.secure_url;

        const payload = {
          ...values,
          dob: new Date(values.dob),
          profileImage: imageUrl,
          role: role,
        };
        console.log("payload", payload);

        await dispatch(Register({ formData: payload }));
        toast.success("User Registered Successfully");
        navigate("/home");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      toast.warning("please select an image to upload");
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-start text-xl prime-sm">
          Student Registration Form
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                    <label htmlFor="qualification" className="block mb-1">
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
                <div className="p-4 text-center">
                  <input
                    type="file"
                    name="profileImage"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="w-full p-2 border border-gray-300 rounded-md hidden"
                    id="fileInput"
                  />
                  <div className="rounded-full bg-blue-500 w-36 h-36 shadow-sm border-2 border-black m-auto overflow-hidden">
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
                    onClick={handleEdit}
                  >
                    Edit
                  </button>

                  <div className="mb-2 text-start">
                    <label htmlFor="dob" className="block mb-1">
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
                  <div className="mb-2 text-start">
                    <label htmlFor="gender" className="block mb-1">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-600 mt-1 text-sm"
                    />
                  </div>
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default StudentRegistration;
