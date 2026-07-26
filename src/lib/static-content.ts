import type { Service } from "@/data/constants";
import type { DbService } from "@/types";

export function toDbService(service: Service, index: number): DbService {
  return {
    id: service.id,
    created_at: "",
    updated_at: "",
    slug: service.id,
    title: service.title,
    short_description: service.shortDescription,
    description: service.description,
    icon_name: service.iconName,
    features: service.features,
    technologies: service.technologies,
    display_order: index + 1,
    is_active: true,
  };
}
