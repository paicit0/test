"use client";

import { useState, useEffect } from "react";
import react from "react";

interface User {
  userId: string;
  userPassword: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
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
    setFilteredProducts(prevProducts => sortProducts(prevProducts, sortOption));
  }, [productData, sortOption]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const correctUserCredential = userData.find(
      (user) => user.userId == id && user.userPassword == password
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
    setSearch('');
  };

  const toggleShowProduct = () => {
    if (!showProduct) {
      setShowProduct(true);
      setShowUser(false);
      
    } else {
      setShowProduct(false);
    }
    setSearch('');
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {isLoggedIn ? (
        <div>
          Welcome, {id}!
          <button onClick={toggleShowUser}>
            {showUser ? "Hide Users" : "Show Users"}
          </button>
          <button onClick={toggleShowProduct}>
            {showProduct ? "Hide Products" : "Show Products"}
          </button>
          {showUser && (
            <div>
              <div className="search">
                <input
                  id="userSearch"
                  placeholder="Search"
                  onChange={(e) => handleUserSearch(e.target.value)}
                />
              </div>

              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.userId}>User: {user.userId}</div>
                ))
              ) : (
                <div>No users found...</div>
              )}
            </div>
          )}
          {showProduct && (
            <div>
              <div className="search">
                <input
                  id="productSearch"
                  placeholder="Search"
                  onChange={(e) => handleProductSearch(e.target.value)}
                />
              </div>
              <div className="dropdown">
                <select name="sort" onChange={handleSortChange} value={sortOption}>
                  <option value="alphabet">Alphabetically</option>
                  <option value="priceLowtoHigh">Price (Low to High)</option>
                  <option value="priceHightoLow">Price (High to Low)</option>
                </select>
              </div>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id}>
                    Product: {product.title}
                    <br></br>
                    Price: {product.price}
                    <button onClick={() => toggleShowDescription(product.id)}>
                      {visibleDescriptions[product.id]
                        ? "Hide Description"
                        : "Show Description"}
                    </button>
                    {visibleDescriptions[product.id] && (
                      <p>Description: {product.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <div>No products found...</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div>Please Sign in!</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => setId(e.target.value)}
              value={id}
              placeholder="Enter your ID"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your Password"
            />
            <button type="submit">Sign In</button>
            <div>{errorMessage}</div>
          </form>
        </div>
      )}
    </div>
  );
}
