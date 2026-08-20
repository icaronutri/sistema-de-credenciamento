# Security Specification: Gestão de OS - Credenciamento 2027

## 1. Data Invariants
1. **Unidade Isolation**: An operative user belonging to Unit A cannot read, query, or mutate work orders, vehicles, or metrics belonging to Unit B.
2. **Oficina Isolation**: An accredited workshop cannot view or edit work orders belonging to another workshop. An assigned workshop can only submit diagnostic items, execution progress, invoices, and attachments for its assigned work order.
3. **Master Authority**: Only Master Admin accounts can approve/reject budgets, review and confer invoices (NF), change unit/workshop assignments, finalize OS, cancel OS, or create/inactivate units and accredited shops.
4. **State Machine Locking**: An OS in terminal states (FINALIZADA, CANCELADA) cannot have its financial items modified. Invoices must be marked CONFERIDO before an OS can transition to FINALIZADA.

## 2. The "Dirty Dozen" Threat Payloads
1. **Privilege Escalation**: Non-master user setting `perfil: "MASTER"` on user doc.
2. **Cross-Unit Read**: Unit user querying `ordensServico` with different `unidadeId`.
3. **Cross-Shop Read**: Workshop user querying `ordensServico` assigned to another `oficinaId`.
4. **Unsolicited Budget Approval**: Workshop user trying to update OS status to `APROVADA` or `valorAprovado`.
5. **Direct Status Shortcut to Finalized**: Workshop user attempting to move OS from `EM_EXECUCAO` directly to `FINALIZADA`.
6. **NF Tampering after Conference**: Modifying invoice amount after it has been marked `CONFERIDO`.
7. **Orphan Item Injection**: Creating an `ItemOrcamento` pointing to an unauthorized or non-existent `osId`.
8. **Vehicle Unit Reassignment**: Unit user attempting to change a vehicle's `unidadeId`.
9. **Fake Document Conference**: Workshop user attempting to set `statusDocumento: "CONFERIDO"` on their own uploaded invoice.
10. **Denial-of-Wallet Payload**: Injecting large junk strings (>2000 chars) in problem description or comments.
11. **Shadow Field Injection**: Injecting unauthorized flags like `isAudited: true` during simple status updates.
12. **Master Impersonation via Spoofed Email**: Attempting writes without verified auth.

## 3. Firestore Rules Architecture
All rules use RBAC with helper functions verifying `MASTER`, `UNIDADE` matching `unidadeId`, and `OFICINA` matching `oficinaId`.
