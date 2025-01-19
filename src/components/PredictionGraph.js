import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Chart as ChartJS } from "chart.js/auto";
import { db, auth } from "./firebase";

const PredictionGraph = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPredictions(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPredictions = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setPredictions(userData.predictions || []);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
    datasets: [
      {
        label: "Predicted Expenses",
        data: predictions,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue fill
        borderColor: "#3b82f6", // Solid blue line
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
        },
      },
      y: {
        beginAtZero: true,
        max: 1000,
        ticks: {
          stepSize: 200,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
          callback: (value) => `₹${value}`,
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y}`,
        },
      },
    },
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Expense Predictions
          <span className="text-sm font-normal text-gray-500 ml-2">
            Next 6 Months
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionGraph;