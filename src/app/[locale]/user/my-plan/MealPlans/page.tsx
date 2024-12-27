"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
export interface MealPlanType {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  mainGoal: string;
  duration: number;
  meals: {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: MealCategory;
    ingredients: {
      id: string;
      name: string;
      quantity: string;
    };
    instructions: string;
    calories?: number;
    vegan: boolean;
    preparationTime: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }[];
}

export type MealCategory = "breakfast" | "lunch" | "dinner";

interface MealPlansListProps {
  plans: MealPlanType[];
  className?: string;
}

const MealPlanList: React.FC<MealPlansListProps> = ({ plans, className }) => {
  return (
    <div className={`bg-black text-white h-auto ${className ? className : ""}`}>
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#252525] rounded-lg">
        {plans.map((plan) => (
          <Link href={`Plans/MealPlans/${plan.id}`} key={plan.id}>
            <div className="bg-black p-4 rounded-lg shadow-lg flex flex-row space-y-2">
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-semibold mb-1">{plan.name}</h2>
                  <div className="space-y-1 text-xs font-extralight">
                    <p className="text-xs font-extralight line-clamp-3">
                      <span className=""></span> {plan.description}
                    </p>
                  </div>
                </div>
                <div className="">
                  <p className="text-xs">
                    <span className=""></span> {plan.mainGoal}
                  </p>
                  <p className="text-xs flex items-center gap-2 font-extralight">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-customBlue"
                    />
                    {plan.duration}
                  </p>
                </div>
              </div>
              <Image
                src={`/Images/mealPlans/${plan.slug}.jpg`}
                alt={plan.name}
                className="w-60 h-40 object-contain rounded-lg"
                width={500}
                height={500}
              />
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default MealPlanList;
