package com.newlecture.backend.menu.adapter.in.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newlecture.backend.menu.domain.Category;
import com.newlecture.backend.menu.application.port.in.GetCustomerCategoryUseCase;

@RestController
@RequestMapping("/categories")
public class CustomerCategoryController {

    private final GetCustomerCategoryUseCase getCustomerCategoryUseCase;

    public CustomerCategoryController(GetCustomerCategoryUseCase getCustomerCategoryUseCase) {
        this.getCustomerCategoryUseCase = getCustomerCategoryUseCase;
    }

    @GetMapping
    public List<Category> getCategories() {
        return getCustomerCategoryUseCase.getAll();
    }
}
