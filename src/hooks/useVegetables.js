import { useEffect, useMemo, useState } from "react";
import fetchData from "../utilities.js";
import { vegetable } from "../../back/vegetable.js";

export default function useVegetables() {

    const [vegetables, setVegetables] = useState([])

    const api = "http://localhost:3333"

    useEffect(() => {
        getVegetables()
    }, [])

    const getVegetables = async () => {
        try {
            setVegetables(vegetable)
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    const getSingleVegetable = async (id) => {
        const idToFind = parseInt(id)
        const response = vegetables.find(item => item.id === idToFind)

        if (response === undefined) {
            throw new Error("Error fetching single data:")
        }
        return response
    }

    //const deleteVegetables = async (id) => {
    //    const idToFind = parseInt(id);
    //    const response = vegetables.find(vegetable => vegetable.id === idToFind);

    //    console.log(response);

    //    if (response) {
    //        setVegetables(prev => prev.filter(item => item.id !== id))
    //    }
    //    if (!response) {
    //        throw new Error("Error deleting data:", response)
    //    }
    //}

    const deleteVegetables = async (id) => {
    try {
        const idToFind = parseInt(id);
        const response = vegetables.find(vegetable => vegetable.id === idToFind);

        console.log(response);

        if (response) {
            setVegetables(prev => prev.filter(item => item.id !== idToFind));
        } else {
            throw new Error("Vegetable not found with id: " + id);
        }

    } catch (error) {
        console.error("Error deleting data:", error);
        throw error; // opzionale, puoi rilanciarlo o gestirlo qui
    }
};


    const addVegetables = async (data) => {
        const response = await fetch(`${api}/vegetables`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok", response.messageS);
        }
        if (response) {
            setVegetables(prev => [...prev, { id: prev.length + 1, ...data }])
        }

    }

    const putVegetables = async (id, data) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "title": data.title,
                "calories": parseInt(data.calories),
                "category": data.category,
                "nutritionalValues": data.nutritionalValues
            })
        };
        const response = await fetch(`${api}/vegetables/${id}`, requestOptions);

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Error details:", errorDetails);
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const updatedVegetable = await response.json();

        // Aggiorna lo stato locale
        setVegetables(prev => prev.map(vegetable => fruit.id === id ? updatedFruit : vegetable));

    };

    const allCategory = useMemo(() => {
        const categories = []
        vegetables.forEach((item) => {
            if (!categories.includes(item.category)) {
                categories.push(item.category)
            }
        })
        return categories
    }, [vegetables])

    return [vegetables, setVegetables, getVegetables, getSingleVegetable, deleteVegetables, addVegetables, putVegetables, allCategory];
}