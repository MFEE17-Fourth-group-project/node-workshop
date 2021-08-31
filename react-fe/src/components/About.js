import axios from "axios";
import { API_URL, IMAGE_URL } from "../utils/config";
import { useAuth } from "../context/auth";

const About = () => {
  const { member } = useAuth();

  return (
    <div className="m-7">
      <h2 className="m-7 text-2xl text-gray-600">這裡是魚股市</h2>
      {member ? (
        <>
          <h3>Hi, {member.name}</h3>
          <img src={`${IMAGE_URL}${member.photo}`} />
        </>
      ) : (
        <h3>尚未登入</h3>
      )}
    </div>
  );
};

export default About;
