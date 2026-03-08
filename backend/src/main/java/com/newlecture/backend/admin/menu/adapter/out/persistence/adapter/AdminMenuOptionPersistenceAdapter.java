package com.newlecture.backend.admin.menu.adapter.out.persistence.adapter;

import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionDetailJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.entity.MenuOptionGroupJpaEntity;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionDetailJpaRepository;
import com.newlecture.backend.admin.menu.adapter.out.persistence.repository.AdminMenuOptionGroupJpaRepository;
import com.newlecture.backend.admin.menu.application.port.out.MenuOptionRepository;
import com.newlecture.backend.admin.menu.domain.MenuOptionDetail;
import com.newlecture.backend.admin.menu.domain.MenuOptionGroup;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component("adminMenuOptionPersistenceAdapter")
@RequiredArgsConstructor
public class AdminMenuOptionPersistenceAdapter implements MenuOptionRepository {

    private final AdminMenuOptionGroupJpaRepository groupRepository;
    private final AdminMenuOptionDetailJpaRepository detailRepository;

    @Override
    public List<MenuOptionGroup> findByMenuId(Long menuId) {
        List<MenuOptionGroupJpaEntity> groupEntities = groupRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        List<Long> groupIds = groupEntities.stream().map(MenuOptionGroupJpaEntity::getId).collect(Collectors.toList());
        
        List<MenuOptionDetailJpaEntity> detailEntities = new ArrayList<>();
        if (!groupIds.isEmpty()) {
            detailEntities = detailRepository.findAllByOptionGroupIdInOrderBySortOrderAsc(groupIds);
        }

        List<MenuOptionGroup> groups = new ArrayList<>();
        for (MenuOptionGroupJpaEntity gEntity : groupEntities) {
            List<MenuOptionDetail> details = detailEntities.stream()
                    .filter(d -> d.getOptionGroupId().equals(gEntity.getId()))
                    .map(dEntity -> MenuOptionDetail.builder()
                            .id(dEntity.getId())
                            .optionGroupId(dEntity.getOptionGroupId())
                            .name(dEntity.getName())
                            .additionalPrice(dEntity.getAdditionalPrice())
                            .sortOrder(dEntity.getSortOrder())
                            .createdAt(dEntity.getCreatedAt())
                            .updatedAt(dEntity.getUpdatedAt())
                            .build())
                    .collect(Collectors.toList());

            groups.add(MenuOptionGroup.builder()
                    .id(gEntity.getId())
                    .menuId(gEntity.getMenuId())
                    .name(gEntity.getName())
                    .isRequired(gEntity.getIsRequired())
                    .isMultiple(gEntity.getIsMultiple())
                    .sortOrder(gEntity.getSortOrder())
                    .createdAt(gEntity.getCreatedAt())
                    .updatedAt(gEntity.getUpdatedAt())
                    .optionDetails(details)
                    .build());
        }

        return groups;
    }

    @Override
    public void deleteByMenuId(Long menuId) {
        List<MenuOptionGroupJpaEntity> groupEntities = groupRepository.findAllByMenuIdOrderBySortOrderAsc(menuId);
        List<Long> groupIds = groupEntities.stream().map(MenuOptionGroupJpaEntity::getId).collect(Collectors.toList());
        if (!groupIds.isEmpty()) {
            detailRepository.deleteByOptionGroupIdIn(groupIds);
        }
        groupRepository.deleteByMenuId(menuId);
    }

    @Override
    public MenuOptionGroup save(MenuOptionGroup optionGroup) {
        MenuOptionGroupJpaEntity gEntity = MenuOptionGroupJpaEntity.builder()
                .id(optionGroup.getId())
                .menuId(optionGroup.getMenuId())
                .name(optionGroup.getName())
                .isRequired(optionGroup.getIsRequired())
                .isMultiple(optionGroup.getIsMultiple())
                .sortOrder(optionGroup.getSortOrder())
                .createdAt(optionGroup.getCreatedAt() == null ? LocalDateTime.now() : optionGroup.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();
        
        MenuOptionGroupJpaEntity savedGroup = groupRepository.save(gEntity);

        List<MenuOptionDetail> savedDetails = new ArrayList<>();
        if (optionGroup.getOptionDetails() != null) {
            for (MenuOptionDetail detail : optionGroup.getOptionDetails()) {
                MenuOptionDetailJpaEntity dEntity = MenuOptionDetailJpaEntity.builder()
                        .id(detail.getId())
                        .optionGroupId(savedGroup.getId())
                        .name(detail.getName())
                        .additionalPrice(detail.getAdditionalPrice())
                        .sortOrder(detail.getSortOrder())
                        .createdAt(detail.getCreatedAt() == null ? LocalDateTime.now() : detail.getCreatedAt())
                        .updatedAt(LocalDateTime.now())
                        .build();
                MenuOptionDetailJpaEntity savedDEntity = detailRepository.save(dEntity);
                
                savedDetails.add(MenuOptionDetail.builder()
                        .id(savedDEntity.getId())
                        .optionGroupId(savedDEntity.getOptionGroupId())
                        .name(savedDEntity.getName())
                        .additionalPrice(savedDEntity.getAdditionalPrice())
                        .sortOrder(savedDEntity.getSortOrder())
                        .createdAt(savedDEntity.getCreatedAt())
                        .updatedAt(savedDEntity.getUpdatedAt())
                        .build());
            }
        }

        return MenuOptionGroup.builder()
                .id(savedGroup.getId())
                .menuId(savedGroup.getMenuId())
                .name(savedGroup.getName())
                .isRequired(savedGroup.getIsRequired())
                .isMultiple(savedGroup.getIsMultiple())
                .sortOrder(savedGroup.getSortOrder())
                .createdAt(savedGroup.getCreatedAt())
                .updatedAt(savedGroup.getUpdatedAt())
                .optionDetails(savedDetails)
                .build();
    }
}
