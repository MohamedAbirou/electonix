import { db } from "@/lib/db";
import moment from "moment";

export async function getGraphData() {
  try {
    // get the start and end dates for the data range (e.g., last 6 months)
    const startDate = moment().subtract(6, "months").startOf("month");
    const endDate = moment().endOf("month");

    // Query the database to get the order data grouped by createdDate
    const result = await db.order.groupBy({
      by: ["createDate"],
      where: {
        createDate: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
        status: "complete",
      },
      _sum: {
        amount: true,
      },
    });

    // Initialize an object to aggregate the data by day
    const aggregatedData: {
      [month: string]: { month: string; date: string; totalAmount: number };
    } = {};

    // Create a clone of the start date to iterate over each day
    const currentDate = startDate.clone();

    // Iterate over each day in the date range
    while (currentDate <= endDate) {
      // Format the month as a string (e.g. "January")
      const month = currentDate.format("MMMM");
      console.log("month: ", month, currentDate);

      // Initialize the aggregated data for the month with the month, date, and totalAmount
      aggregatedData[month] = {
        month,
        date: currentDate.format("MM-YYYY"),
        totalAmount: 0,
      };

      //   Move to the next month
      currentDate.add(1, "month");
    }

    // Calculate the total amount for each month by summing the order amounts
    result.forEach((entry) => {
      const month = moment(entry.createDate).format("MMMM");
      const amount = entry._sum.amount || 0;
      aggregatedData[month].totalAmount += amount;
    });

    // Convert the aggregatedData object to an array and sort it by date
    const formattedData = Object.values(aggregatedData).sort((a, b) =>
      moment(a.date, "MM-YYYY").diff(moment(b.date, "MM-YYYY"))
    );

    // Return the formatted data
    return formattedData;
  } catch (error) {
    console.log("[GET_GRAPH_DATA]", error);
    return null;
  }
}
