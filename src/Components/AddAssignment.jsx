import React, { useEffect, useState } from "react";
import "./../css/addassignment.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiActivity } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

function AddAssignment() {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.isAdmin === true) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !term) {
      toast.error("All fields are mandatory");
      return;
    }
    const config = {
      headers: {
        authorization: `Bearer ${user?.accessToken}`,
      },
    };

    try {
      const addedFlight = await axios.post(
        `${BASE_URL + "/loans"}`,
        {
          amount: Number(amount),
          term: Number(term),
        },
        config
      );

      setAmount(null);
      setTerm(null);

      if (addedFlight) {
        toast.success("Loan taken successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="add-flight-container">
      <h2>Take Loan</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Term</label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          />
        </div>

        <div className="button-group">
          <button className="submit-btn" type="submit">
            <FiActivity /> Take Loan
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              navigate("/");
            }}
            type="button"
          >
            <IoArrowBack />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAssignment;
