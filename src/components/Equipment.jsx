import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import "../styles/sty.css";

const equipmentList = [
  { title: "Treadmill", description: "A machine for running or walking in place, adjustable for speed and incline." },
  { title: "Elliptical", description: "Low-impact cardio machine simulating stair climbing, walking, or running." },
  { title: "SpinningBike", description: "Stationary bike designed for high-intensity indoor cycling workouts." },
  { title: "AirRower", description: "Rowing machine using air resistance to simulate rowing on water." },
  { title: "AirBike", description: "Cardio equipment combining arms and legs movement with air resistance." },
  { title: "VerticalChestPress", description: "Machine targeting the chest muscles with a vertical pressing motion." },
  { title: "Pec_Fly/Rear_Delt", description: "Dual-function machine for chest flyes and rear delt exercises." },
  { title: "Multi_Functional_Station", description: "Versatile unit offering various strength training exercises." },
  { title: "Multi_Press", description: "Adjustable machine for performing multiple press exercises." },
  { title: "Standing_Fly/Deltoids", description: "Machine for isolating and working the deltoid muscles." },
  { title: "Flat/Incline_Bench", description: "Adjustable bench for various pressing and support exercises." },
  { title: "Power_Bench", description: "Sturdy bench designed for heavy lifting and support." },
  { title: "Half_Rack", description: "Versatile rack for squats, bench press, and other barbell exercises." },
  { title: "Smith_Machine_Counter_Balanced", description: "Assisted barbell machine for guided weightlifting." },
  { title: "Power_Squat", description: "Machine focused on performing squats with added stability and resistance." },
  { title: "45°_Leg_Press", description: "Leg press machine set at a 45-degree angle for lower body workouts." },
  { title: "Leg_Curl/Extension", description: "Machine for targeting hamstrings with curls and quadriceps with extensions." },
  { title: "Adductor/Abductor", description: "Machine to strengthen inner (adductor) and outer (abductor) thigh muscles." },
  { title: "Preacher_Curl_Bench", description: "Bench designed to isolate and target the bicep muscles." },
  { title: "Back_Extension", description: "Equipment which for strengthening the lower back hyperextension exercises." },
  { title: "Abdominal_Board", description: "Adjustable board for performing various abdominal exercises." },
  { title: "Pull_Over", description: "Machine focusing on latissimus dorsi and pectoral muscles with a pulling motion." },
  { title: "Isolateral Row", description: "Machine which allowing independent rowing motion for each arm, targeting back muscles." },
  { title: "Multi_Angled_T-Bar", description: "Rowing equipment with multiple grip options for back workouts." },
  { title: "Wrist_Curl", description: "Bench or machine for isolating and strengthening the forearm muscles." },
  { title: "Lat_Rowing", description: "Dual-function machine for lat pulldowns and seated rows." },
  { title: "Assisted_Dip_Chin", description: "Machine which providing assistance for performing dips and chin-ups." },
  { title: "Dumbbells(2.5 kg to 35 kg)", description: "Free weights available in various increments for strength training." },
];
const Equipment = ({ title, description }) => (
  <div className="flex flex-col items-start p-2">
    <div className="flex items-center mb-2">
      <div className="bg-70AB0E-800 p-2 rounded-full mr-3 border-2 border-black">
        <FontAwesomeIcon
          icon={faDumbbell}
          className="text-black text-lg"
          style={{ transform: "rotate(45deg)" }}
        />
      </div>
      <div className="text-black text-xl font-norwester">
        {title}
      </div>
    </div>
    <p className="text-black text-lg text-justify flex-grow">
      {description}
    </p>
  </div>
);

const EquipmentGrid = () => (
  <div className="flex justify-center items-center w-full px-2 sm:px-4">
    <div className="w-full max-w-[1100px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {equipmentList.map((item, index) => (
          <Equipment
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  </div>
);

export default EquipmentGrid;
