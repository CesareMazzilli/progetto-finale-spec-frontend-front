import { useEffect, useMemo, useState } from "react";
import fetchData from "../utilities";
import { vegetable } from "../../back/vegetable";

export default function useVegetables() {

    const [vegetables, setVegetables] = useState([])

    useEffect(() => {
        getVegetables()
    }, [])

    const getVegetables = async () => {
        try {
            setVegetables(vegetable)
            console.log("vegetable is:", vegetable);
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
        // todo Aggiungere controlli ai dati iin input
        const response = true
        if (response) {
            setVegetables(prev => [...prev, { id: prev.length + 1, ...data }])
        }
    }

    const putVegetables = async (id, data) => {

        const idToFind = parseInt(id);
        const response = vegetables.find(vegetable => vegetable.id === idToFind);

        if (response === undefined) {

            throw new Error(`Network response was not ok`);
        }

        // Aggiorna lo stato locale
        setVegetables(prev => prev.map(vegetable => vegetable.id === id ? data : vegetable));

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