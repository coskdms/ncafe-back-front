package com.newlecture.backend.admin.menu.application.port.in;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface UpdateMenuImagesUseCase {
    void updateMenuImages(Long menuId, List<MultipartFile> files, List<Long> retainedImageIds, List<String> imageOrder);
}
