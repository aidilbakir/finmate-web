package com.finmate.dao;

import com.finmate.exception.DatabaseException;
import java.util.List;

/**
 * Base DAO Interface dengan generic CRUD operations
 * Demonstrasi: Interface & Generics
 * 
 * @param <T> Entity type
 * @param <ID> ID type
 */
public interface IBaseDAO<T, ID> {
    
    /**
     * Create new entity
     * @param entity Entity to create
     * @return Created entity with ID
     * @throws DatabaseException if database error occurs
     */
    T create(T entity) throws DatabaseException;
    
    /**
     * Find entity by ID
     * @param id Entity ID
     * @return Entity or null if not found
     * @throws DatabaseException if database error occurs
     */
    T findById(ID id) throws DatabaseException;
    
    /**
     * Find all entities for a user
     * @param userId User ID
     * @return List of entities
     * @throws DatabaseException if database error occurs
     */
    List<T> findAll(int userId) throws DatabaseException;
    
    /**
     * Update existing entity
     * @param entity Entity to update
     * @return Updated entity
     * @throws DatabaseException if database error occurs
     */
    T update(T entity) throws DatabaseException;
    
    /**
     * Delete entity by ID
     * @param id Entity ID
     * @return true if deleted, false if not found
     * @throws DatabaseException if database error occurs
     */
    boolean delete(ID id) throws DatabaseException;
}
