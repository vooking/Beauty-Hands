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
  const [selectedCategory, setSelectedCategory] = useState<string | number>('Все');
  const [formItems, setFormItems] = useState<ServiceFormItem[]>([
    {
      id: Date.now(),
      name: '',
      priceMaster: '',
      priceTopMaster: '',
      hasTopMasterPrice: false,
    },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка данных
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories?type=service`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [categoriesData, servicesData] = await Promise.all([
          categoriesRes.json(),
          servicesRes.json(),
        ]);

        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }

        setServices(servicesData);
        setFilteredServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotification({ message: 'Ошибка загрузки данных', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фильтрация услуг по категории
  useEffect(() => {
    if (selectedCategory === 'Все') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        (service) => service.category_id.toString() === selectedCategory.toString()
      );
      setFilteredServices(filtered);
    }
  }, [selectedCategory, services]);

  const parsePrice = (prices: any) => {
    if (!prices) return '-';

    try {
      const parsed = typeof prices === 'string' ? JSON.parse(prices) : prices;

      if (parsed.topMaster) {
        return isMobile 
          ? `М: ${parsed.master} ₽, Т: ${parsed.topMaster} ₽`
          : `Мастер: ${parsed.master} ₽, Топ-мастер: ${parsed.topMaster} ₽`;
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
      setSelectedServices(selectedServices.filter((serviceId) => serviceId !== id));
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedServices(filteredServices.map((service) => service.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleFormItemChange = (
    id: number,
    field: keyof ServiceFormItem,
    value: any
  ) => {
    setFormItems(
      formItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCheckboxChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFormItemChange(
      id,
      e.target.name as keyof ServiceFormItem,
      e.target.checked
    );
  };

  const addFormItem = () => {
    if (editingServiceId) return;
    setFormItems([
      ...formItems,
      {
        id: Date.now(),
        name: '',
        priceMaster: '',
        priceTopMaster: '',
        hasTopMasterPrice: false,
      },
    ]);
  };

  const removeFormItem = (id: number) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter((item) => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormItems([
      {
        id: Date.now(),
        name: '',
        priceMaster: '',
        priceTopMaster: '',
        hasTopMasterPrice: false,
      },
    ]);
    setEditingServiceId(null);
  };

  const showConfirmationDialog = (message: string): Promise<boolean> => {
    return new Promise(resolve => {
      const userConfirmed = window.confirm(message);
      resolve(userConfirmed);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !selectedCategoryId) return;

    setIsLoading(true);
    try {
      const validItems = formItems.filter(
        (item) => item.name.trim() && item.priceMaster
      );

      if (validItems.length === 0) {
        setNotification({ message: 'Заполните хотя бы одну услугу', type: 'error' });
        return;
      }

      if (editingServiceId) {
        const item = validItems[0];
        const prices: any = { master: item.priceMaster };
        
        if (item.hasTopMasterPrice && item.priceTopMaster) {
          prices.topMaster = item.priceTopMaster;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${editingServiceId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category_id: selectedCategoryId,
              name: item.name,
              prices: JSON.stringify(prices),
            }),
          }
        );

        if (!response.ok) throw new Error('Ошибка при обновлении услуги');

        setNotification({ 
          message: 'Услуга успешно обновлена', 
          type: 'success' 
        });
      } else {
        const responses = await Promise.all(
          validItems.map((item) => {
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
                prices: JSON.stringify(prices),
              }),
            });
          })
        );

        const allOk = responses.every((response) => response.ok);
        if (!allOk) throw new Error('Ошибка при добавлении некоторых услуг');

        setNotification({
          message: `Успешно добавлено ${validItems.length} услуг`,
          type: 'success',
        });
      }

      // Обновление списка услуг
      const updatedServices = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedData = await updatedServices.json();

      setServices(updatedData);
      setFilteredServices(
        selectedCategory === 'Все'
          ? updatedData
          : updatedData.filter(
              (service: any) =>
                service.category_id.toString() === selectedCategory.toString()
            )
      );
      resetForm();
    } catch (e) {
      console.error(e);
      setNotification({
        message: editingServiceId 
          ? 'Ошибка при обновлении услуги' 
          : 'Ошибка при добавлении услуг',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedServices.length === 0) {
      setNotification({ 
        message: 'Выберите услуги для удаления', 
        type: 'error' 
      });
      return;
    }

    const isConfirmed = await showConfirmationDialog(
      `Вы уверены, что хотите удалить ${selectedServices.length} услуг?`
    );
    if (!isConfirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const responses = await Promise.all(
        selectedServices.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const allOk = responses.every((response) => response.ok);
      if (!allOk) throw new Error('Ошибка при удалении некоторых услуг');

      setServices(services.filter((s) => !selectedServices.includes(s.id)));
      setSelectedServices([]);
      setNotification({
        message: `Успешно удалено ${selectedServices.length} услуг`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      setNotification({ 
        message: 'Ошибка при массовом удалении', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await showConfirmationDialog('Вы уверены, что хотите удалить эту услугу?');
    if (!isConfirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Токен не найден', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(services.filter((s) => s.id !== id));
      setFilteredServices(filteredServices.filter((s) => s.id !== id));
      setNotification({ 
        message: 'Услуга успешно удалена', 
        type: 'success' 
      });
    } catch (error) {
      console.error(error);
      setNotification({ 
        message: 'Ошибка при удалении услуги', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      <AdminNavbar />
      
      {/* Уведомление */}
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg animate-notification text-sm md:text-base ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`} style={{ 
          maxWidth: isMobile ? 'calc(100% - 2rem)' : 'auto',
          width: isMobile ? 'auto' : 'max-content'
        }}>
          {notification.message}
        </div>
      )}

      <main className="text-[#4b4845] p-6 md:ml-64 max-w-4xl mx-auto ">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Управление услугами</h1>

        {/* Форма добавления/редактирования */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-gray-50 p-3 md:p-4 rounded"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {editingServiceId ? 'Редактирование услуги' : 'Добавление услуг'}
          </h2>
          
          <div>
            <label className="block mb-1 text-sm md:text-base font-medium">Категория</label>
            <select
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              className="border p-2 w-full rounded text-sm md:text-base"
              required
              disabled={isLoading}
            >
              <option value="" disabled>Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {formItems.map((item, index) => (
            <div key={item.id} className="space-y-3 border-b pb-3 mb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-medium">Услуга №{index + 1}</h3>
                {formItems.length > 1 && !editingServiceId && (
                  <button
                    type="button"
                    onClick={() => removeFormItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={isLoading}
                  >
                    Удалить
                  </button>
                )}
              </div>
              
              <div>
                <label className="block mb-1 text-sm md:text-base font-medium">Название услуги</label>
                <input
                  value={item.name}
                  onChange={(e) => handleFormItemChange(item.id, 'name', e.target.value)}
                  required
                  className="border p-2 w-full rounded text-sm md:text-base"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm md:text-base font-medium">Цена мастера (₽)</label>
                <input
                  value={item.priceMaster}
                  onChange={(e) => handleFormItemChange(item.id, 'priceMaster', e.target.value)}
                  required
                  type="number"
                  className="border p-2 w-full rounded text-sm md:text-base"
                  placeholder="Введите цену"
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <label
                  htmlFor={`topMasterPrice-${item.id}`}
                  className="font-medium text-sm md:text-base"
                >
                  Добавить цену для топ-мастера
                </label>
              </div>
              
              {item.hasTopMasterPrice && (
                <div>
                  <label className="block mb-1 text-sm md:text-base font-medium">
                    Цена топ-мастера (₽)
                  </label>
                  <input
                    value={item.priceTopMaster}
                    onChange={(e) =>
                      handleFormItemChange(item.id, 'priceTopMaster', e.target.value)
                    }
                    type="number"
                    className="border p-2 w-full rounded text-sm md:text-base"
                    placeholder="Введите цену"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {!editingServiceId && (
              <button
                type="button"
                onClick={addFormItem}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm md:text-base"
                disabled={isLoading}
              >
                <span className="text-lg">+</span> Добавить еще услугу
              </button>
            )}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:ml-auto">
              {editingServiceId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-600 text-sm md:text-base"
                  disabled={isLoading}
                >
                  Отмена
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-500 disabled:bg-gray-400 text-sm md:text-base"
              >
                {editingServiceId ? 'Обновить' : 'Добавить'}
              </button>
            </div>
          </div>
        </form>

        {/* Фильтр и кнопка массового удаления */}
        <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="w-full md:w-auto">
            <label className="block mb-1 text-sm md:text-base font-medium">Фильтр по категории</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
              className="border p-2 rounded w-full md:w-auto text-sm md:text-base"
              disabled={isLoading}
            >
              <option value="Все">Все категории</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          {selectedServices.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-red-700 disabled:bg-red-400 text-sm md:text-base whitespace-nowrap"
            >
              Удалить выбранные ({selectedServices.length})
            </button>
          )}
        </div>

        {/* Список услуг - мобильная и десктопная версии */}
        {isMobile ? (
          <div className="space-y-3">
            {isLoading && !filteredServices.length ? (
              <div className="text-center py-4 text-sm">Загрузка данных...</div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const category = categories.find((c) => c.id === service.category_id);
                return (
                  <div key={service.id} className="border rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={(e) => handleServiceSelect(service.id, e.target.checked)}
                          className="h-4 w-4"
                          disabled={isLoading}
                        />
                        <span className="font-medium text-sm">{service.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {category?.name || 'Неизвестно'}
                      </div>
                    </div>
                    <div className="text-xs mb-2">{parsePrice(service.prices)}</div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const prices = typeof service.prices === 'string'
                            ? JSON.parse(service.prices)
                            : service.prices;
                          setFormItems([{
                            id: Date.now(),
                            name: service.name,
                            priceMaster: prices.master || '',
                            priceTopMaster: prices.topMaster || '',
                            hasTopMasterPrice: !!prices.topMaster,
                          }]);
                          setSelectedCategoryId(service.category_id);
                          setEditingServiceId(service.id);
                        }}
                        className="text-blue-600 hover:underline text-xs"
                        disabled={isLoading}
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:underline text-xs"
                        disabled={isLoading}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">
                Услуги не найдены
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {isLoading && !filteredServices.length ? (
              <div className="text-center py-8">Загрузка данных...</div>
            ) : (
              <table className="w-full text-left border-collapse text-sm md:text-base">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-2 px-4">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedServices.length === filteredServices.length &&
                          filteredServices.length > 0
                        }
                        className="h-4 w-4"
                        disabled={isLoading}
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
                    filteredServices.map((service) => {
                      const category = categories.find(
                        (c) => c.id === service.category_id
                      );
                      return (
                        <tr key={service.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={(e) =>
                                handleServiceSelect(service.id, e.target.checked)
                              }
                              className="h-4 w-4"
                              disabled={isLoading}
                            />
                          </td>
                          <td className="py-2 px-4">
                            {category?.name || 'Неизвестно'}
                          </td>
                          <td className="py-2 px-4">{service.name}</td>
                          <td className="py-2 px-4">
                            {parsePrice(service.prices)}
                          </td>
                          <td className="py-2 px-4 space-x-2">
                            <button
                              onClick={() => {
                                const prices =
                                  typeof service.prices === 'string'
                                    ? JSON.parse(service.prices)
                                    : service.prices;
                                setFormItems([
                                  {
                                    id: Date.now(),
                                    name: service.name,
                                    priceMaster: prices.master || '',
                                    priceTopMaster: prices.topMaster || '',
                                    hasTopMasterPrice: !!prices.topMaster,
                                  },
                                ]);
                                setSelectedCategoryId(service.category_id);
                                setEditingServiceId(service.id);
                              }}
                              className="text-blue-600 hover:underline"
                              disabled={isLoading}
                            >
                              Редактировать
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-red-600 hover:underline"
                              disabled={isLoading}
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
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default withAuth(ServicesAdmin);