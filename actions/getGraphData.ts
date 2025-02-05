import { db } from "@/lib/db";
import moment from "moment";

export async function getGraphData(year: number) {
  try {
    // Get the start and end dates for the selected year
    const startDate = moment().year(year).startOf("year");
    const endDate = moment().year(year).endOf("year");

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

    // Initialize an object to aggregate the data by month
    const aggregatedData: {
      [month: string]: { month: string; date: string; totalAmount: number };
    } = {};

    // Create a clone of the start date to iterate over each month
    const currentDate = startDate.clone();

    // Iterate over each month in the date range
    while (currentDate <= endDate) {
      // Format the month as a string (e.g. "January")
      const month = currentDate.format("MMMM");

      // Initialize the aggregated data for the month with the month, date, and totalAmount
      aggregatedData[month] = {
        month,
        date: currentDate.format("MM-YYYY"),
        totalAmount: 0,
      };

      // Move to the next month
      currentDate.add(1, "month");
    }

    // Calculate the total amount for each month by summing the order amounts
    // getGraphData.ts
    result.forEach((entry) => {
      const month = moment(entry.createDate).format("MMMM");
      const amount = (entry._sum.amount || 0) / 100;
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
