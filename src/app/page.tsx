"use client";

import { useState, useEffect } from "react";
import react from "react";
import "./globals.css";

interface User {
  userId: string;
  userPassword: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  rating: number;
}

type SortOption = "alphabet" | "priceLowtoHigh" | "priceHightoLow";

export default function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState<User[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [visibleDescriptions, setVisibleDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const [showUser, setShowUser] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("alphabet");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUser = await fetch("/json/users.json");
        const responseProduct = await fetch("/json/products.json");
        const usersData = await responseUser.json();
        const productsData = await responseProduct.json();
        setUserData(usersData.users);
        setProductData(productsData.products);

        setFilteredUsers(usersData.users);
        setFilteredProducts(productsData.products);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProducts((prevProducts) =>
      sortProducts(prevProducts, sortOption)
    );
  }, [productData, sortOption]);

  useEffect(() => {
    setFilteredProducts(sortProducts(productData, sortOption));
  }, [productData, sortOption]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const correctUserCredential = userData.find(
      (user) => user.userId === id && user.userPassword === password
    );

    if (correctUserCredential) {
      setIsLoggedIn(true);
    } else {
      setErrorMessage("Wrong ID or Password!");
    }
  };

  const toggleShowDescription = (id: number) => {
    console.log("toggleShowDescription!");
    setVisibleDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleShowUser = () => {
    if (!showUser) {
      setShowUser(true);
      setShowProduct(false);
    } else {
      setShowUser(false);
    }
    setSearch("");
    setFilteredProducts(productData);
  };

  const toggleShowProduct = () => {
    if (!showProduct) {
      setShowProduct(true);
      setShowUser(false);
    } else {
      setShowProduct(false);
    }
    setSearch("");
    setFilteredUsers(userData);
  };

  const handleUserSearch = (search: string) => {
    setSearch(search);
    setFilteredUsers(
      userData.filter((user) =>
        user.userId.toLowerCase().startsWith(search.toLowerCase())
      )
    );
  };

  const handleProductSearch = (search: string) => {
    setSearch(search);
    const filtered = productData.filter((product) =>
      product.title.toLowerCase().startsWith(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
  };

  const sortProducts = (products: Product[], option: SortOption) => {
    switch (option) {
      case "alphabet":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case "priceLowtoHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "priceHightoLow":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto overflow-y-auto">
        {isLoggedIn ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Welcome, {id}!
            </h1>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={toggleShowUser}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                {showUser ? "Hide Users" : "Show Users"}
              </button>
              <button
                onClick={toggleShowProduct}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                {showProduct ? "Hide Products" : "Show Products"}
              </button>
            </div>

            {showUser && (
              <div className="mb-8">
                <div className="relative">
                  <input
                    id="userSearch"
                    placeholder="Search Users"
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="w-full p-2 pl-10 border rounded-md text-black"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.userId} className="p-2 bg-gray-50 rounded text-black">
                        User: {user.userId}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No users found...</div>
                  )}
                </div>
              </div>
            )}

            {showProduct && (
              <div className="mb-8">
                <div className="flex space-x-4 mb-4">
                  <div className="relative flex-grow text-black">
                    <input
                      id="productSearch"
                      placeholder="Search Products"
                      onChange={(e) => handleProductSearch(e.target.value)}
                      className="w-full p-2 pl-10 border rounded-md"
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="sort"
                      onChange={handleSortChange}
                      value={sortOption}
                      className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="alphabet">Alphabetically</option>
                      <option value="priceLowtoHigh">
                        Price (Low to High)
                      </option>
                      <option value="priceHightoLow">
                        Price (High to Low)
                      </option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white p-4 rounded-md shadow"
                      >
                        <h3 className="text-lg font-semibold text-black">
                          {product.title}
                        </h3>
                        <p className="text-gray-600">Price: ${product.price}</p>
                        <button
                          onClick={() => toggleShowDescription(product.id)}
                          className="mt-2 text-blue-500 hover:text-blue-700"
                        >
                          {visibleDescriptions[product.id]
                            ? "Hide Description"
                            : "Show Description"}
                        </button>
                        {visibleDescriptions[product.id] && (
                          <p className="mt-2 text-gray-700">
                            <div>{product.description}</div>
                            <br></br>
                            <div>Rating: {product.rating}</div>
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No products found...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Please Sign In
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  onChange={(e) => setId(e.target.value)}
                  value={id}
                  placeholder="Enter your ID"
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your Password"
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Sign In
              </button>
              {errorMessage && (
                <div className="text-red-500 text-center">{errorMessage}</div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
