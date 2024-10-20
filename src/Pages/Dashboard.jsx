import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiActivity } from "react-icons/fi";

import AssignmentCard from "../Components/AssignmentCard";
import "../css/register.css";
import "../css/dashboard.css";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [assigment, setAssignment] = useState([]);
  const [toFetch, setToFetch] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchAssigment = async () => {
      setIsLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
      };

      try {
        const res = await axios.get(`${BASE_URL + "/loans/user"}`, config);

        if (res) {
          setAssignment(res.data.data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsloading(false);
      }
    };
    fetchAssigment();
  }, [user, dispatch, navigate, toFetch]);

  return (
    <div className="con">
      <section className="main">
        <h1>Welcome, {user && user.name}</h1>
        <button
          className="add"
          onClick={() => {
            navigate("/loan");
            setToFetch(true);
          }}
        >
          <FiActivity className="upload-icon" />
          Take new loan
        </button>
      </section>

      <section className="show_contact">
        <h1 className="h1">Loans list</h1>

        {assigment.length > 0 ? (
          <div className="contact">
            {assigment.map((con) => {
              return (
                <AssignmentCard
                  key={con._id}
                  con={con}
                  toFetch={toFetch}
                  setToFetch={setToFetch}
                />
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "45vh",
              flexDirection: "column",
            }}
          >
            {isLoading ? (
              <h1 style={{ fontWeight: 500 }}>loading.. please wait</h1>
            ) : (
              <h1 style={{ fontWeight: 500 }}>
                No loans available at this moment.
              </h1>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
