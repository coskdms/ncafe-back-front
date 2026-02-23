package com.newlecture.backend.menu.application.port.in;

import com.newlecture.backend.menu.domain.Category;
import java.util.List;

public interface GetCustomerCategoryUseCase {
    List<Category> getAll();
}
