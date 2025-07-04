import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './DetailPage.css';
import AppLike from '../components/AppLike';
import AppModal from '../components/AppModal';
import { useGlobalContext } from '../context/GlobalContext';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function DetailPage() {

    const { id } = useParams()
    const { getSingleVegetable, putVegetables } = useGlobalContext()

    const [vegetableData, setVegetableData] = useState({})
    const [modalBool, setModalBool] = useState(false)
    const [formData, setFormData] = useState({});

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (index === undefined) {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData(prevState => ({
                ...prevState,
                nutritionalValues: prevState.nutritionalValues.map((item, i) =>
                    i === index ? { ...item, [name]: value } : item
                )
            }))
        }
    }

    const addRowFormData = () => {
        setFormData(prevState => ({
            ...prevState,
            nutritionalValues: [...prevState.nutritionalValues, { name: "", quantity: 0, unit: "" }]
        }))
    }

    const getData = async () => {
        try {
            setVegetableData(await getSingleVegetable(id))
        } catch (error) {
            console.error("Error fetching vegetable data:", error)
        }
    }

    //al modify far vedere elemento modificato
    const handleModify = useCallback(debounce((id, formData) => {
        setVegetableData(formData)
        setModalBool(false)
        try {
            putVegetables(id, formData);
        } catch (error) {
            console.error(error);
        }

    }, 250), []);

    useEffect(() => {
        getData()
    }, [id])

    useEffect(() => {
        setFormData(vegetableData);
    }, [vegetableData]);

    return (
        <>
            <section className='card'>
                <h1>{vegetableData.title}</h1>
                <AppLike id={parseInt(id)}></AppLike>
                <FontAwesomeIcon className='detail-icon-top-right' icon={faPen} onClick={() => setModalBool(prev => !prev)} />
                <div>{vegetableData.category}</div>
                <div>Calorie: {vegetableData.calories}</div>
                {vegetableData.nutritionalValues && vegetableData.nutritionalValues.map((item, index) => {
                    return (
                        <div className='nutritionalValues' key={index}>
                            <span>{item.name}</span>
                            <span>{item.quantity} {item.unit}</span>
                        </div>
                    )
                })
                }
            </section>

            <button onClick={() => setModalBool(prev => !prev)} className="fixed-bottom-right-button">
                +
            </button>

            <AppModal
                isOpen={modalBool}
                title={<h4>Modifica verdura</h4>}
                onClose={() => setModalBool(false)}
                addBtn={<button onClick={addRowFormData}>+</button>}
                onConfirm={() => {
                    handleModify(id, formData);
                    setModalBool(false);
                }}
                content={
                    <form>
                        <input type='text' name="title" onChange={handleInputChange} value={formData.title} placeholder='Nome' />
                        <input type='text' name="category" onChange={handleInputChange} value={formData.category} placeholder='Categoria' />
                        <input type='number' name="calories" onChange={handleInputChange} value={formData.calories} placeholder='Calorie' />

                        {formData.nutritionalValues && formData.nutritionalValues.map((item, index) => {
                            return (
                                <div className='nutritionalValues' key={index}>
                                    <input type='text' name="name" onChange={(e) => handleInputChange(e, index)} value={item.name} placeholder='Nome' />
                                    <input type='number' name="quantity" onChange={(e) => handleInputChange(e, index)} value={item.quantity} placeholder='Quantità' />
                                    {/* possibilità di fare un select */}
                                    <input type='text' name="unit" onChange={(e) => handleInputChange(e, index)} value={item.unit} placeholder='unità' />
                                </div>
                            )
                        })}
                    </form>}

            />

        </>
    )
}