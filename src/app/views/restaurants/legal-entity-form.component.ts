import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService, LegalEntity } from '../../services/supabase.service';

@Component({
  selector: 'app-legal-entity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-entity-form.component.html',
  styleUrls: ['./legal-entity-form.component.css']
})
export class LegalEntityFormComponent implements OnInit {
  isEditMode = false;
  entityId: string | null = null;
  isSaving = false;

  form: LegalEntity = {
    name: '',
    legal_name: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legal_address: '',
    actual_address: '',
    phone: '',
    email: '',
    director: '',
    accountant: '',
    bank_name: '',
    bik: '',
    correspondent_account: '',
    payment_account: '',
    is_draft: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    this.entityId = this.route.snapshot.paramMap.get('id');

    if (this.entityId) {
      this.isEditMode = true;
      await this.loadEntity();
    }
  }

  async loadEntity() {
    try {
      const entity = await this.supabaseService.getLegalEntity(this.entityId!);
      if (entity) {
        this.form = entity;
      }
    } catch (error) {
      console.error('Error loading legal entity:', error);
      alert('Ошибка загрузки данных');
    }
  }

  async saveDraft() {
    await this.save(true);
  }

  async saveEntity() {
    await this.save(false);
  }

  async save(isDraft: boolean) {
    if (!this.form.name?.trim()) {
      alert('Пожалуйста, введите название');
      return;
    }

    this.isSaving = true;
    this.form.is_draft = isDraft;

    try {
      if (this.isEditMode && this.entityId) {
        await this.supabaseService.updateLegalEntity(this.entityId, this.form);
      } else {
        await this.supabaseService.createLegalEntity(this.form);
      }

      alert(isDraft ? 'Черновик сохранен' : 'Юридическое лицо сохранено');
      this.router.navigate(['/network-settings/restaurants']);
    } catch (error) {
      console.error('Error saving legal entity:', error);
      alert('Ошибка сохранения');
    } finally {
      this.isSaving = false;
    }
  }

  cancel() {
    this.router.navigate(['/network-settings/restaurants']);
  }
}
