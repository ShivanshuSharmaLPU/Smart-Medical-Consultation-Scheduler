import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import RelatedDoctor from '../components/RelatedDoctor';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendURL, token, getAllDoctorsData } = useContext(AppContext);
    const navigate = useNavigate();

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    useEffect(() => {
        if (doctors && docId) {
            const doc = doctors.find(doc => doc._id === docId);
            setDocInfo(doc);
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            generateAvailableSlots();
        }
    }, [docInfo]);

    const generateAvailableSlots = () => {
        if (!docInfo) return;

        setDocSlots([]);
        let today = new Date();

        let slotsArray = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            currentDate.setHours(10, 0, 0, 0);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                let day = currentDate.getDate();
                let month = currentDate.getMonth() + 1;
                let year = currentDate.getFullYear();
                const slotDate = `${day}_${month}_${year}`;

                const isSlotAvailable = !docInfo?.slots_booked?.[slotDate]?.includes(formattedTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            slotsArray.push(timeSlots);
        }

        setDocSlots(slotsArray);
    };

    const handleTimeSelect = (time) => {
        setSlotTime(time);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book an appointment');
            return navigate('/login');
        }

        if (!slotTime || docSlots.length === 0 || docSlots[slotIndex].length === 0) {
            toast.warn('Please select a valid time slot');
            return;
        }

        try {
            const date = docSlots[slotIndex][0].datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = `${day}_${month}_${year}`;

            const { data } = await axios.post(`${backendURL}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                getAllDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error('Error booking appointment. Try again.');
        }
    };

    return (
        docInfo && (
            <div>
                {/* Doctor Details */}
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div>
                        <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="Doctor" />
                    </div>
                    <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                        <p>{docInfo.name}
                            <img className='w-5' src={assets.verified_icon} alt="Verified" />
                        </p>
                        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                            <p>{docInfo.degree} - {docInfo.speciality}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience} years</button>
                        </div>
                        <div>
                            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About
                                <img src={assets.info_icon} alt="Info" />
                            </p>
                            <p className='text:sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                        </div>
                        <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
                    </div>
                </div>

                {/* Booking Slots */}
                <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700 mt-4'>
                    <p>Booking slots</p>
                    <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                        {docSlots.length > 0 && docSlots.map((item, index) => (
                            <div 
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white ' : 'border border-gray-200'}`} 
                                key={index}
                                onClick={() => setSlotIndex(index)}
                            >
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                        {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                            <p 
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slotTime === item.time ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                key={index}
                                onClick={() => handleTimeSelect(item.time)}
                            >
                                {item.time}
                            </p>
                        ))}
                    </div>

                    {slotTime && (
                        <div className="mt-4">
                            <p>Selected Time: <span className="font-medium">{slotTime}</span></p>
                        </div>
                    )}

                    <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
                </div>

                {/* Related Doctors */}
                <RelatedDoctor docId={docId} speciality={docInfo.speciality} />
            </div>
        )
    );
};

export default Appointment;
