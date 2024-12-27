"use client";
import React, {useState} from "react";
import Image from "next/image";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    category: string;
    ingredients: {
      id: string;
      name: string;
      quantity: string;
    }[];
    instructions: string;
    calories?: number;
    vegan: boolean;
    preparationTime: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  }[];
}

export interface MealType {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  ingredients: {
    id: string;
    name: string;
    quantity: string;
  }[];
  instructions: string;
  calories?: number;
  vegan: boolean;
  preparationTime: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

interface MealListProps {
  meals: MealType[];
  className?: string;
}


const MealList: React.FC<MealListProps> = ({meals, className}) => {
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const filteredmeals: MealType[] =
    filter === "All"
      ? meals
      : meals.filter((meal) =>
        filter === "breakfast"
          ? meal.category.toLowerCase().includes("breakfast")
          : filter === "lunch"
            ? meal.category.toLowerCase().includes("lunch")
            : filter === "dinner"
              ? meal.category.toLowerCase().includes("dinner")
              : false
      );

  const handleMealClick = (meal: MealType) => {
    setSelectedMeal(meal);
    setShowModal(true);
  };
  return (
    <div className={`flex flex-col md:flex-row h-screen text-white rounded-3xl ${className || ""}`}>
      {/* Sidebar */}
      <div className="w-full md:w-1/2 p-4 bg-[#1e1e1e]">
      <nav className="bg-[#2a2a2a] p-2 rounded-full flex flex-wrap lg:flex-nowrap justify-start gap-4 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#555555] scrollbar-track-transparent scroll-p-4">
  {["All", "breakfast", "lunch", "dinner", "snack", "other"].map((category) => (
    <button
      key={category}
      onClick={() => setFilter(category)}
      className={`px-5 py-1 text-xs rounded-full ${
        filter === category ? "bg-customBlue" : "bg-[#1e1e1e] hover:bg-[#555555]"
      }`}
    >
      {category}
    </button>
  ))}
</nav>

        {/* Meal List */}
        <ul className="space-y-2">
          {filteredmeals.map((meal) => (
            <li
              key={meal.slug}
              onClick={() => handleMealClick(meal)}
              className={`flex items-center justify-between p-3 cursor-pointer rounded-full px-4 ${
                selectedMeal?.slug === meal.slug
                  ? "bg-customBlue"
                  : "bg-[#2a2a2a] hover:bg-[#333333]"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm">{meal.name}</h3>
                {meal.ingredients?.map((ingredient) => (
                  <p key={ingredient.id} className="text-xs text-gray-300 font-extralight">
                    {ingredient.name}
                  </p>
                )) || (
                  <p className="text-xs text-gray-300 font-extralight">
                    No ingredients available.
                  </p>
                )}
              </div>
              <button className="text-white text-lg font-bold">
                {meal.calories} <span className="text-xs font-extralight">Kcal</span>
              </button>
            </li>
          ))}
        </ul>

      </div>

      {/* Modal for Small Screens */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 md:hidden">
          <div className="bg-[#1e1e1e] p-4 rounded-lg text-center w-11/12 max-w-md">
            <button
              className="absolute top-2 right-4 text-gray-300 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <Image src={`/Images/meals/${selectedMeal?.slug}.jpg`} alt={selectedMeal?.name || ""} width={500} height={500}
                   className="w-full rounded-md mb-4"/>
            <h2 className="text-xl font-bold mb-2">{selectedMeal?.name}</h2>

            <p className="text-xs text-gray-300 font-extralight">
              {/*{meals.find((meal) => meal.name === selectedMeal)?.ingredients.name}*/}
            </p>
          </div>
        </div>
      )}

      {/* Image Preview for Larger Screens */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#1e1e1e] p-1">
        <div className="w-full md:w-2/3 h-60 md:h-2/3 rounded-lg relative flex flex-col gap-3">
          <Image src={`/Images/meals/${selectedMeal?.slug}.jpg`} alt={selectedMeal?.name || ""} width={500} height={500}
                 className="w-full rounded-md"/>
          <img
            src={`${NEXT_PUBLIC_API_BASE_URL}/uploads/meals/${
              selectedMeal ? selectedMeal.slug : ""
            }`}
            alt={selectedMeal ? selectedMeal.name : ""}
            // layout="fill"
            // objectFit="cover"
            className="rounded-lg"
          />
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-2xl font-bold">{selectedMeal?.name}</h2>
            <p className="text-xs text-gray-300 font-extralight">
              {meals.find((meal) => meal.slug === selectedMeal?.slug)?.ingredients[0].name}
            </p>
          </div>
          <button>
            <span className="text-white text-lg font-bold px-5 py-1 rounded-full bg-customBlue">
              {meals.find((meal) => meal.slug === selectedMeal?.slug)?.calories}{" "}
              <span className="text-xs font-extralight">Kcal</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealList;