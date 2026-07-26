import { Form, InputGroup, Button } from "react-bootstrap";
import { useState } from "react";
import styles from "./search-bar.module.css";

export const SearchBar = ({ onSearch }) => {
    const [termino, setTermino] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(termino);
    };

    return (
        <Form onSubmit={handleSubmit} className={styles.searchContainer}>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Buscar objetos..."
                    value={termino}
                    onChange={(e) => setTermino(e.target.value)}
                    className={styles.searchInput}
                />
                <Button variant="primary" type="submit" className={styles.searchButton}>
                    Buscar
                </Button>
            </InputGroup>
        </Form>
    );
};