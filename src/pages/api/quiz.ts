// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Quiz } from "@/types/quiz";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log("req.body", req.body);
  res.status(200).json({});
  //   res.status(200).json({
  //     questions: [
  //       {
  //         text: "What is the linear correlation coefficient used for?",
  //         options: [
  //           {
  //             text: "Quantifying the strength and direction of the relationship between two variables",
  //             is_correct: true,
  //           },
  //           {
  //             text: "Determining causation between two variables",
  //             is_correct: false,
  //           },
  //           {
  //             text: "Measuring the distance between data points",
  //             is_correct: false,
  //           },
  //           {
  //             text: "Calculating the probability of a specific outcome",
  //             is_correct: false,
  //           },
  //         ],
  //       },
  //       {
  //         text: "Which statement is true about the linear correlation coefficient?",
  //         options: [
  //           {
  //             text: "It always ranges from 0 to 1",
  //             is_correct: false,
  //           },
  //           {
  //             text: "It is a unitless measure",
  //             is_correct: true,
  //           },
  //           {
  //             text: "It only measures the strength of a nonlinear relationship",
  //             is_correct: false,
  //           },
  //           {
  //             text: "It can be used to prove causation between two variables",
  //             is_correct: false,
  //           },
  //         ],
  //       },
  //     ],
  //   });
}
