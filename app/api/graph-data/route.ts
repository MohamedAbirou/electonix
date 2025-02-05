import { getGraphData } from "@/actions/getGraphData";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year"));

  const data = await getGraphData(year);
  return NextResponse.json(data);
}
