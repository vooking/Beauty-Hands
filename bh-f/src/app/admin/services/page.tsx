'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import withAuth from '@/app/components/withAuth';

interface ServiceFormItem {
  id: number;
  name: string;
  priceMaster: string;
  priceTopMaster: string;
  hasTopMasterPrice: boolean;
}

const ServicesAdmin = () => {
    const [services, setServices] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [filteredServices, setFilteredServices] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [formItems, setFormItems] = useState<ServiceFormItem[]>([
      {
        id: Date.now(),
        name: '',
        priceMaster: '',
        priceTopMaster: '',
        hasTopMasterPrice: false
      }
    ]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedServices, setSelectedServices] = useState<number[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchData = async () => {
            try {
                // Загружаем категории
                const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories?type=service`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);
                if (categoriesData.length > 0) {
                  setSelectedCategoryId(categoriesData[0].id);
                }

                // Загружаем услуги
                const servicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const servicesData = await servicesRes.json();
                setServices(servicesData);
                setFilteredServices(servicesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'Все') {
            setFilteredServices(services);
        } else {
            const filtered = services.filter(service => service.category_id === selectedCategory);
            setFilteredServices(filtered);
        }
    }, [selectedCategory, services]);

    const parsePrice = (prices: any) => {
        if (!prices) return '-';
        
        try {
            const parsed = typeof prices === 'string' ? JSON.parse(prices) : prices;
            
            if (parsed.topMaster) {
                return `Мастер: ${parsed.master} ₽, Топ-мастер: ${parsed.topMaster} ₽`;
            }
            return `${parsed.master} ₽`;
        } catch {
            return `${prices} ₽`;
        }
    };

    const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(e.target.value);
    };

    const handleServiceSelect = (id: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedServices([...selectedServices, id]);
        } else {
            setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedServices(filteredServices.map(service => service.id));
        } else {
            setSelectedServices([]);
        }
    };

    const handleFormItemChange = (id: number, field: keyof ServiceFormItem, value: any) => {
        setFormItems(formItems.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleCheckboxChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        handleFormItemChange(id, e.target.name as keyof ServiceFormItem, e.target.checked);
    };

    const addFormItem = () => {
        setFormItems([
            ...formItems,
            {
                id: Date.now(),
                name: '',
                priceMaster: '',
                priceTopMaster: '',
                hasTopMasterPrice: false
            }
        ]);
    };

    const removeFormItem = (id: number) => {
        if (formItems.length > 1) {
            setFormItems(formItems.filter(item => item.id !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !selectedCategoryId) return;

        try {
            const validItems = formItems.filter(item => item.name.trim() && item.priceMaster);
            
            if (validItems.length === 0) {
                alert('Заполните хотя бы одну услугу');
                return;
            }

            const responses = await Promise.all(
                validItems.map(item => {
                    const prices: any = { master: item.priceMaster };
                    
                    if (item.hasTopMasterPrice && item.priceTopMaster) {
                        prices.topMaster = item.priceTopMaster;
                    }

                    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            category_id: selectedCategoryId,
                            name: item.name,
                            prices: JSON.stringify(prices)
                        })
                    });
                })
            );

            const allOk = responses.every(response => response.ok);
            if (!allOk) throw new Error('Ошибка при добавлении некоторых услуг');

            // Обновляем список услуг
            const updatedServices = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedData = await updatedServices.json();
            
            setServices(updatedData);
            setFormItems([{
                id: Date.now(),
                name: '',
                priceMaster: '',
                priceTopMaster: '',
                hasTopMasterPrice: false
            }]);
            alert(`Успешно добавлено ${validItems.length} услуг`);
        } catch (e) {
            alert('Ошибка при добавлении услуг');
        }
    };

    const handleBulkDelete = async () => {
        const token = localStorage.getItem('token');
        if (!token || selectedServices.length === 0 || !confirm(`Удалить ${selectedServices.length} выбранных услуг?`)) return;

        try {
            const responses = await Promise.all(
                selectedServices.map(id => 
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const allOk = responses.every(response => response.ok);
            if (!allOk) throw new Error('Ошибка при удалении некоторых услуг');

            setServices(services.filter(s => !selectedServices.includes(s.id)));
            setSelectedServices([]);
            alert(`Успешно удалено ${selectedServices.length} услуг`);
        } catch (error) {
            alert('Ошибка при массовом удалении');
        }
    };

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token || !confirm('Удалить услугу?')) return;

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            setServices(services.filter(s => s.id !== id));
        } catch (error) {
            alert('Ошибка при удалении');
        }
    };

    return (
        <>
            <AdminNavbar />
            <main className="p-6 max-w-4xl mx-auto text-[#4b4845]">
                <h1 className="text-2xl font-semibold mb-6">Управление услугами</h1>

                {/* Форма добавления услуг */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-4 rounded">
                    <h2 className="text-xl font-semibold">Добавление услуг</h2>
                    <div>
                        <label className="block mb-1 font-medium">Категория</label>
                        <select 
                            value={selectedCategoryId} 
                            onChange={handleCategoryChange} 
                            className="border p-2 w-full rounded"
                            required
                        >
                            <option value="" disabled>Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {formItems.map((item, index) => (
                        <div key={item.id} className="space-y-4 border-b pb-4 mb-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">Услуга №{index + 1}</h3>
                                {formItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFormItem(item.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Название услуги</label>
                                <input 
                                    value={item.name} 
                                    onChange={(e) => handleFormItemChange(item.id, 'name', e.target.value)}
                                    required 
                                    className="border p-2 w-full rounded" 
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Цена мастера (₽)</label>
                                <input 
                                    value={item.priceMaster} 
                                    onChange={(e) => handleFormItemChange(item.id, 'priceMaster', e.target.value)}
                                    required 
                                    type="number"
                                    className="border p-2 w-full rounded" 
                                    placeholder="Введите цену"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`topMasterPrice-${item.id}`}
                                    name="hasTopMasterPrice"
                                    checked={item.hasTopMasterPrice}
                                    onChange={(e) => handleCheckboxChange(item.id, e)}
                                    className="h-4 w-4"
                                />
                                <label htmlFor={`topMasterPrice-${item.id}`} className="font-medium">
                                    Добавить цену для топ-мастера
                                </label>
                            </div>
                            {item.hasTopMasterPrice && (
                                <div>
                                    <label className="block mb-1 font-medium">Цена топ-мастера (₽)</label>
                                    <input 
                                        value={item.priceTopMaster} 
                                        onChange={(e) => handleFormItemChange(item.id, 'priceTopMaster', e.target.value)}
                                        type="number"
                                        className="border p-2 w-full rounded" 
                                        placeholder="Введите цену"
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <button 
                            type="button"
                            onClick={addFormItem}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                            <span className="text-xl">+</span> Добавить еще услугу
                        </button>
                        <button 
                            type="submit" 
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-500 ml-auto"
                        >
                            Добавить
                        </button>
                    </div>
                </form>

                {/* Фильтр по категориям */}
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <label className="block mb-1 font-medium">Фильтр по категории</label>
                        <select 
                            value={selectedCategory} 
                            onChange={handleCategoryFilterChange}
                            className="border p-2 rounded"
                        >
                            <option value="Все">Все категории</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {selectedServices.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Удалить выбранные ({selectedServices.length})
                        </button>
                    )}
                </div>

                {/* Таблица */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                                        className="h-4 w-4"
                                    />
                                </th>
                                <th className="py-2 px-4">Категория</th>
                                <th className="py-2 px-4">Название</th>
                                <th className="py-2 px-4">Цены</th>
                                <th className="py-2 px-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length > 0 ? (
                                filteredServices.map(service => {
                                    const category = categories.find(c => c.id === service.category_id);
                                    return (
                                        <tr key={service.id} className="border-b">
                                            <td className="py-2 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedServices.includes(service.id)}
                                                    onChange={(e) => handleServiceSelect(service.id, e.target.checked)}
                                                    className="h-4 w-4"
                                                />
                                            </td>
                                            <td className="py-2 px-4">{category?.name || 'Неизвестно'}</td>
                                            <td className="py-2 px-4">{service.name}</td>
                                            <td className="py-2 px-4">{parsePrice(service.prices)}</td>
                                            <td className="py-2 px-4 space-x-2">
                                                <button
                                                    onClick={() => {
                                                        const prices = typeof service.prices === 'string' ? JSON.parse(service.prices) : service.prices;
                                                        setFormItems([{
                                                            id: Date.now(),
                                                            name: service.name,
                                                            priceMaster: prices.master || '',
                                                            priceTopMaster: prices.topMaster || '',
                                                            hasTopMasterPrice: !!prices.topMaster
                                                        }]);
                                                        setSelectedCategoryId(service.category_id);
                                                    }}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                        Услуги не найдены
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
};

export default withAuth(ServicesAdmin);